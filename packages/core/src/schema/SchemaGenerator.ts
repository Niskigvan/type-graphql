import createDebug from "debug";

import MetadataBuilder from "@src/metadata/builder/MetadataBuilder";
import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLFieldConfigMap,
  GraphQLOutputType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputType,
} from "graphql";
import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import {
  wrapWithModifiers,
  convertTypeIfScalar,
} from "@src/schema/type-converting";
import TypeValue from "@src/interfaces/TypeValue";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import { BuiltTypeMetadata } from "@src/metadata/builder/definitions/common";
import CannotDetermineOutputTypeError from "@src/errors/CannotDetermineOutputTypeError";
import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import flatten from "@src/helpers/flatten";
import RuntimeGenerator from "@src/runtime/RuntimeGenerator";
import {
  BuildSchemaConfig,
  createSchemaConfig,
} from "@src/schema/schema-config";
import getFirstDefinedValue from "@src/helpers/getFirstDefinedValue";
import objectFromEntries from "@src/helpers/objectFromEntries";
import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";
import CannotDetermineInputTypeError from "@src/errors/CannotDetermineInputTypeError";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import { MissingClassMetadataError } from "@src/errors";

const debug = createDebug("@typegraphql/core:SchemaGenerator");

export default class SchemaGenerator<TContext extends object = {}> {
  private readonly config: BuildSchemaConfig<TContext>;
  private readonly metadataBuilder: MetadataBuilder<TContext>;
  private readonly runtimeGenerator: RuntimeGenerator<TContext>;
  private readonly objectTypeByClassMap = new WeakMap<
    ClassType,
    GraphQLObjectType
  >();
  private readonly inputTypeByClassMap = new WeakMap<
    ClassType,
    GraphQLInputObjectType
  >();

  constructor(options: BuildSchemaOptions<TContext>) {
    debug("created SchemaGenerator instance", options);
    this.config = createSchemaConfig(options);
    this.metadataBuilder = new MetadataBuilder(this.config);
    this.runtimeGenerator = new RuntimeGenerator(this.config);
  }

  generateSchema(): GraphQLSchema {
    return new GraphQLSchema({
      query: this.generateQueryType(),
      types: this.generateOrphanedTypes(),
    });
  }

  private generateQueryType(): GraphQLObjectType {
    const resolversMetadata = this.config.resolvers.map(resolverClass =>
      this.metadataBuilder.getResolverMetadataByClass(resolverClass),
    );
    // TODO: attach resolver metadata reference to query metadata
    const queries = flatten(resolversMetadata.map(it => it.queries));

    return new GraphQLObjectType({
      name: "Query",
      fields: this.getQueryFields(queries),
    });
  }

  private getQueryFields(
    queries: BuiltQueryMetadata[],
  ): GraphQLFieldConfigMap<unknown, TContext, object> {
    return objectFromEntries(
      queries.map<[string, GraphQLFieldConfig<unknown, TContext, object>]>(
        queryMetadata => [
          queryMetadata.schemaName,
          {
            type: this.getGraphQLOutputType(queryMetadata),
            description: queryMetadata.description,
            resolve: this.runtimeGenerator.generateQueryResolveHandler(
              queryMetadata,
            ),
          },
        ],
      ),
    );
  }

  private generateOrphanedTypes(): GraphQLNamedType[] {
    if (!this.config.orphanedTypes) {
      return [];
    }
    return this.config.orphanedTypes.map(orphanedTypeClass => {
      const namedType =
        this.findObjectTypeByClass(orphanedTypeClass) ??
        this.findInputTypeByClass(orphanedTypeClass);
      if (!namedType) {
        throw new MissingClassMetadataError(orphanedTypeClass);
      }
      return namedType;
    });
  }

  private findObjectTypeByClass(
    typeClass: ClassType,
  ): GraphQLObjectType | undefined {
    const objectTypeMetadata = MetadataStorage.get().findObjectTypeMetadata(
      typeClass,
    );
    if (!objectTypeMetadata) {
      return undefined;
    }
    return this.getObjectTypeByClass(typeClass);
  }

  private getObjectTypeByClass(typeClass: ClassType): GraphQLObjectType {
    if (this.objectTypeByClassMap.has(typeClass)) {
      return this.objectTypeByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = this.metadataBuilder.getObjectTypeMetadataByClass(
      typeClass,
    );

    const objectType = new GraphQLObjectType({
      name: objectTypeMetadata.schemaName,
      description: objectTypeMetadata.description,
      fields: this.getGraphQLFields(objectTypeMetadata.fields),
    });

    this.objectTypeByClassMap.set(typeClass, objectType);
    return objectType;
  }

  private findInputTypeByClass(
    typeClass: ClassType,
  ): GraphQLInputObjectType | undefined {
    const inputTypeMetadata = MetadataStorage.get().findInputTypeMetadata(
      typeClass,
    );
    if (!inputTypeMetadata) {
      return undefined;
    }
    return this.getInputTypeByClass(typeClass);
  }

  private getInputTypeByClass(typeClass: ClassType): GraphQLInputObjectType {
    if (this.inputTypeByClassMap.has(typeClass)) {
      return this.inputTypeByClassMap.get(typeClass)!;
    }

    const inputTypeMetadata = this.metadataBuilder.getInputTypeMetadataByClass(
      typeClass,
    );

    const inputType = new GraphQLInputObjectType({
      name: inputTypeMetadata.schemaName,
      description: inputTypeMetadata.description,
      fields: this.getGraphQLInputFields(inputTypeMetadata.fields),
    });

    this.inputTypeByClassMap.set(typeClass, inputType);
    return inputType;
  }

  private getGraphQLFields(
    fields: BuiltFieldMetadata[],
  ): GraphQLFieldConfigMap<unknown, unknown, unknown> {
    return objectFromEntries(
      fields.map<[string, GraphQLFieldConfig<unknown, unknown, unknown>]>(
        fieldMetadata => [
          fieldMetadata.schemaName,
          {
            type: this.getGraphQLOutputType(fieldMetadata),
            description: fieldMetadata.description,
          },
        ],
      ),
    );
  }

  private getGraphQLInputFields(
    fields: BuiltFieldMetadata[],
  ): GraphQLInputFieldConfigMap {
    return objectFromEntries(
      fields.map<[string, GraphQLInputFieldConfig]>(fieldMetadata => [
        fieldMetadata.schemaName,
        {
          type: this.getGraphQLInputType(fieldMetadata),
          description: fieldMetadata.description,
        },
      ]),
    );
  }

  private getGraphQLOutputType(
    metadata: TargetMetadata & PropertyMetadata & BuiltTypeMetadata,
  ): GraphQLOutputType {
    const outputType = getFirstDefinedValue(
      this.searchForGraphQLOutputType(metadata.type.value),
    );
    if (!outputType) {
      throw new CannotDetermineOutputTypeError(metadata);
    }
    return wrapWithModifiers(outputType, metadata.type.modifiers);
  }

  private *searchForGraphQLOutputType(
    typeValue: TypeValue,
  ): Generator<GraphQLOutputType | undefined, void, void> {
    yield convertTypeIfScalar(typeValue);
    if (typeof typeValue === "function") {
      yield this.findObjectTypeByClass(typeValue as ClassType);
    }
    if (typeValue instanceof GraphQLObjectType) {
      yield typeValue;
    }
  }

  private getGraphQLInputType(
    metadata: TargetMetadata & PropertyMetadata & BuiltTypeMetadata,
  ): GraphQLInputType {
    const inputType = getFirstDefinedValue(
      this.searchForGraphQLInputType(metadata.type.value),
    );
    if (!inputType) {
      throw new CannotDetermineInputTypeError(metadata);
    }
    return wrapWithModifiers(inputType, metadata.type.modifiers);
  }

  private *searchForGraphQLInputType(
    typeValue: TypeValue,
  ): Generator<GraphQLInputType | undefined, void, void> {
    yield convertTypeIfScalar(typeValue);
    if (typeof typeValue === "function") {
      yield this.findInputTypeByClass(typeValue as ClassType);
    }
    if (typeValue instanceof GraphQLInputObjectType) {
      yield typeValue;
    }
  }
}

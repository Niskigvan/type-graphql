import createDebug from "debug";
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
  GraphQLArgumentConfig,
  GraphQLFieldConfigArgumentMap,
} from "graphql";

import MetadataBuilder from "@src/metadata/builder/MetadataBuilder";
import BuildSchemaOptions from "@src/schema/BuildSchemaOptions";
import ClassType from "@src/interfaces/ClassType";
import {
  wrapWithModifiers,
  convertTypeIfScalar,
} from "@src/schema/type-converting";
import TypeValue from "@src/interfaces/TypeValue";
import FieldMetadata from "@src/interfaces/metadata/FieldMetadata";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import CannotDetermineOutputTypeError from "@src/errors/CannotDetermineOutputTypeError";
import {
  TargetClassMetadata,
  PropertyMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";
import flatten from "@src/helpers/flatten";
import RuntimeGenerator from "@src/runtime/RuntimeGenerator";
import {
  BuildSchemaConfig,
  createSchemaConfig,
} from "@src/schema/schema-config";
import getFirstDefinedValue from "@src/helpers/getFirstDefinedValue";
import objectFromEntries from "@src/helpers/objectFromEntries";
import QueryMetadata from "@src/interfaces/metadata/QueryMetadata";
import CannotDetermineInputTypeError from "@src/errors/CannotDetermineInputTypeError";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import MissingClassMetadataError from "@src/errors/MissingClassMetadataError";
import ParamKind from "@src/interfaces/ParamKind";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";
import SpreadArgsParameterMetadata from "@src/interfaces/metadata/parameters/SpreadArgsParameterMetadata";
import SingleArgParamterMetadata from "@src/interfaces/metadata/parameters/SingleArgParameterMetadata";

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
    queries: QueryMetadata[],
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
            args: this.getArgumentConfigFromParameters(
              queryMetadata.parameters,
            ),
          },
        ],
      ),
    );
  }

  private getArgumentConfigFromParameters(
    parameters: ParameterMetadata[],
  ): GraphQLFieldConfigArgumentMap {
    const spreadArgsMetadata = parameters.find(
      it => it.kind === ParamKind.SpreadArgs,
    ) as SpreadArgsParameterMetadata | undefined;
    if (spreadArgsMetadata) {
      const spreadArgsInputTypeMetadata = this.metadataBuilder.getInputTypeMetadataByClass(
        spreadArgsMetadata.type.value as ClassType, // checked in MetadataBuilder
      );
      return this.getArgumentConfigFromMetadata(
        spreadArgsInputTypeMetadata.fields,
      );
    }

    const singleArgMetadata = parameters.filter(
      it => it.kind === ParamKind.SingleArg,
    ) as SingleArgParamterMetadata[];
    return this.getArgumentConfigFromMetadata(singleArgMetadata);
  }

  private getArgumentConfigFromMetadata(
    metadata: Array<
      SchemaNameMetadata &
        DescriptionMetadata &
        TypeMetadata &
        TargetClassMetadata &
        PropertyMetadata
    >,
  ): GraphQLFieldConfigArgumentMap {
    return objectFromEntries(
      metadata.map<[string, GraphQLArgumentConfig]>(paramterMetadata => [
        paramterMetadata.schemaName,
        {
          type: this.getGraphQLInputType(paramterMetadata),
          description: paramterMetadata.description,
        },
      ]),
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
    const objectTypeMetadata = RawMetadataStorage.get().findObjectTypeMetadata(
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
    const inputTypeMetadata = RawMetadataStorage.get().findInputTypeMetadata(
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
    fields: FieldMetadata[],
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
    fields: FieldMetadata[],
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
    metadata: TargetClassMetadata & PropertyMetadata & TypeMetadata,
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
    metadata: TargetClassMetadata & PropertyMetadata & TypeMetadata,
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

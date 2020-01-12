import createDebug from "debug";

import MetadataBuilder from "@src/metadata/builder/MetadataBuilder";
import {
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLFieldConfigMap,
  GraphQLOutputType,
  GraphQLFieldConfig,
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

const debug = createDebug("@typegraphql/core:SchemaGenerator");

export default class SchemaGenerator<TContext extends object = {}> {
  private readonly config: BuildSchemaConfig<TContext>;
  private readonly metadataBuilder: MetadataBuilder<TContext>;
  private readonly runtimeGenerator: RuntimeGenerator<TContext>;
  private readonly typeByClassMap = new WeakMap<ClassType, GraphQLObjectType>();

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
    return (
      this.config.orphanedTypes?.map(orphanedTypeClass =>
        this.getTypeByClass(orphanedTypeClass),
      ) ?? []
    );
  }

  private findTypeByClass(typeClass: ClassType): GraphQLObjectType | undefined {
    return this.typeByClassMap.get(typeClass);
  }

  private getTypeByClass(typeClass: ClassType): GraphQLObjectType {
    if (this.typeByClassMap.has(typeClass)) {
      return this.typeByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = this.metadataBuilder.getTypeMetadataByClass(
      typeClass,
    );

    const objectType = new GraphQLObjectType({
      name: objectTypeMetadata.schemaName,
      description: objectTypeMetadata.description,
      fields: this.getGraphQLFields(objectTypeMetadata.fields),
    });

    this.typeByClassMap.set(typeClass, objectType);
    return objectType;
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
      yield this.findTypeByClass(typeValue as ClassType);
    }
    if (typeValue instanceof GraphQLObjectType) {
      yield typeValue;
    }
  }
}

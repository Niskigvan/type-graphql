import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import ResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import QueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import ParameterMetadata from "@src/metadata/storage/definitions/ParameterMetadata";

const debug = createDebug("@typegraphql/core:MetadataStorage");

// TODO: refactor to map wrappers for easier array operations and exposing collect/find methods without violating DRY
export default class MetadataStorage {
  protected objectTypesMetadataMap = new WeakMap<
    ClassType,
    ObjectTypeMetadata
  >();
  protected fieldsMetadataMap = new WeakMap<ClassType, FieldMetadata[]>();
  protected resolversMetadataMap = new WeakMap<ClassType, ResolverMetadata>();
  protected queriesMetadataMap = new WeakMap<ClassType, QueryMetadata[]>();
  protected parametersMetadataMap = new WeakMap<
    ClassType,
    ParameterMetadata[]
  >();

  protected constructor() {
    debug("created MetadataStorage instance");
  }

  static get(): MetadataStorage {
    if (!global.TypeGraphQLMetadataStorage) {
      global.TypeGraphQLMetadataStorage = new MetadataStorage();
    }
    return global.TypeGraphQLMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: ObjectTypeMetadata): void {
    // TODO: maybe check with `.has` to prevent duplicates?
    this.objectTypesMetadataMap.set(metadata.target, metadata);
  }
  findObjectTypeMetadata(typeClass: ClassType): ObjectTypeMetadata | undefined {
    return this.objectTypesMetadataMap.get(typeClass);
  }

  collectFieldMetadata(metadata: FieldMetadata): void {
    this.fieldsMetadataMap.set(metadata.target, [
      ...(this.fieldsMetadataMap.get(metadata.target) ?? []),
      metadata,
    ]);
  }
  findFieldsMetadata(typeClass: ClassType): FieldMetadata[] | undefined {
    return this.fieldsMetadataMap.get(typeClass);
  }

  collectResolverMetadata(metadata: ResolverMetadata): void {
    this.resolversMetadataMap.set(metadata.target, metadata);
  }
  findResolverMetadata(typeClass: ClassType): ResolverMetadata | undefined {
    return this.resolversMetadataMap.get(typeClass);
  }

  collectQueryMetadata(metadata: QueryMetadata): void {
    this.queriesMetadataMap.set(metadata.target, [
      ...(this.queriesMetadataMap.get(metadata.target) ?? []),
      metadata,
    ]);
  }
  findQueriesMetadata(resolverClass: ClassType): QueryMetadata[] | undefined {
    return this.queriesMetadataMap.get(resolverClass);
  }

  collectParameterMetadata(metadata: ParameterMetadata): void {
    this.parametersMetadataMap.set(metadata.target, [
      ...(this.parametersMetadataMap.get(metadata.target) ?? []),
      metadata,
    ]);
  }
  findParametersMetadata(
    resolverClass: ClassType,
    propertyKey: string | symbol,
  ): ParameterMetadata[] | undefined {
    const resolverClassParameters = this.parametersMetadataMap.get(
      resolverClass,
    );
    return resolverClassParameters?.filter(
      parameterMetadata => parameterMetadata.propertyKey === propertyKey,
    );
  }
}

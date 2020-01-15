import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import ObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import ResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import QueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import ParameterMetadata from "@src/metadata/storage/definitions/ParameterMetadata";
import MetadataWeakMap from "@src/metadata/storage/MetadataWeakMap";
import MetadataArrayWeakMap from "@src/metadata/storage/MetadataArrayWeakMap";
import InputTypeMetadata from "@src/metadata/storage/definitions/InputTypeMetadata";

const debug = createDebug("@typegraphql/core:MetadataStorage");

export default class MetadataStorage {
  protected objectTypesMetadataStorage = new MetadataWeakMap<
    ObjectTypeMetadata
  >();
  protected inputTypesMetadataStorage = new MetadataWeakMap<
    InputTypeMetadata
  >();
  protected fieldsMetadataStorage = new MetadataArrayWeakMap<FieldMetadata>();
  protected resolversMetadataStorage = new MetadataWeakMap<ResolverMetadata>();
  protected queriesMetadataStorage = new MetadataArrayWeakMap<QueryMetadata>();
  protected parametersMetadataStorage = new MetadataArrayWeakMap<
    ParameterMetadata
  >();

  protected constructor() {
    debug("created MetadataStorage instance");
  }

  static get(): MetadataStorage {
    // TODO: investigate using package scoped storage
    if (!global.TypeGraphQLMetadataStorage) {
      global.TypeGraphQLMetadataStorage = new MetadataStorage();
    }
    return global.TypeGraphQLMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: ObjectTypeMetadata): void {
    debug("collecting object type metadata", metadata);
    this.objectTypesMetadataStorage.collect(metadata);
  }
  findObjectTypeMetadata(
    objectTypeClass: ClassType,
  ): ObjectTypeMetadata | undefined {
    return this.objectTypesMetadataStorage.find(objectTypeClass);
  }

  collectInputTypeMetadata(metadata: InputTypeMetadata): void {
    debug("collecting input type metadata", metadata);
    this.inputTypesMetadataStorage.collect(metadata);
  }
  findInputTypeMetadata(
    inputTypeClass: ClassType,
  ): InputTypeMetadata | undefined {
    return this.inputTypesMetadataStorage.find(inputTypeClass);
  }

  collectFieldMetadata(metadata: FieldMetadata): void {
    debug("collecting field metadata", metadata);
    this.fieldsMetadataStorage.collect(metadata);
  }
  findFieldsMetadata(objectClass: ClassType): FieldMetadata[] | undefined {
    return this.fieldsMetadataStorage.find(objectClass);
  }

  collectResolverMetadata(metadata: ResolverMetadata): void {
    debug("collecting resolver metadata", metadata);
    this.resolversMetadataStorage.collect(metadata);
  }
  findResolverMetadata(resolverClass: ClassType): ResolverMetadata | undefined {
    return this.resolversMetadataStorage.find(resolverClass);
  }

  collectQueryMetadata(metadata: QueryMetadata): void {
    debug("collecting query metadata", metadata);
    this.queriesMetadataStorage.collect(metadata);
  }
  findQueriesMetadata(resolverClass: ClassType): QueryMetadata[] | undefined {
    return this.queriesMetadataStorage.find(resolverClass);
  }

  collectParameterMetadata(metadata: ParameterMetadata): void {
    debug("collecting parameter metadata", metadata);
    this.parametersMetadataStorage.collect(metadata);
  }
  findParametersMetadata(
    resolverClass: ClassType,
    propertyKey: string | symbol,
  ): ParameterMetadata[] | undefined {
    const resolverClassParameters = this.parametersMetadataStorage.find(
      resolverClass,
    );
    // TODO: refactor to nested maps?
    return resolverClassParameters?.filter(
      parameterMetadata => parameterMetadata.propertyKey === propertyKey,
    );
  }
}

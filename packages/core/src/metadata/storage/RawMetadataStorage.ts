import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import RawObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import RawFieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import RawResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import RawQueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";
import MetadataWeakMap from "@src/metadata/storage/MetadataWeakMap";
import MetadataArrayWeakMap from "@src/metadata/storage/MetadataArrayWeakMap";
import RawInputTypeMetadata from "@src/metadata/storage/definitions/InputTypeMetadata";

const debug = createDebug("@typegraphql/core:MetadataStorage");

export default class RawMetadataStorage {
  protected objectTypesMetadataStorage = new MetadataWeakMap<
    RawObjectTypeMetadata
  >();
  protected inputTypesMetadataStorage = new MetadataWeakMap<
    RawInputTypeMetadata
  >();
  protected fieldsMetadataStorage = new MetadataArrayWeakMap<
    RawFieldMetadata
  >();
  protected resolversMetadataStorage = new MetadataWeakMap<
    RawResolverMetadata
  >();
  protected queriesMetadataStorage = new MetadataArrayWeakMap<
    RawQueryMetadata
  >();
  protected parametersMetadataStorage = new MetadataArrayWeakMap<
    RawParameterMetadata
  >();

  protected constructor() {
    debug("created MetadataStorage instance");
  }

  static get(): RawMetadataStorage {
    // TODO: investigate using package scoped storage
    if (!global.TypeGraphQLRawMetadataStorage) {
      global.TypeGraphQLRawMetadataStorage = new RawMetadataStorage();
    }
    return global.TypeGraphQLRawMetadataStorage;
  }

  collectObjectTypeMetadata(metadata: RawObjectTypeMetadata): void {
    debug("collecting object type metadata", metadata);
    this.objectTypesMetadataStorage.collect(metadata);
  }
  findObjectTypeMetadata(
    objectTypeClass: ClassType,
  ): RawObjectTypeMetadata | undefined {
    return this.objectTypesMetadataStorage.find(objectTypeClass);
  }

  collectInputTypeMetadata(metadata: RawInputTypeMetadata): void {
    debug("collecting input type metadata", metadata);
    this.inputTypesMetadataStorage.collect(metadata);
  }
  findInputTypeMetadata(
    inputTypeClass: ClassType,
  ): RawInputTypeMetadata | undefined {
    return this.inputTypesMetadataStorage.find(inputTypeClass);
  }

  collectFieldMetadata(metadata: RawFieldMetadata): void {
    debug("collecting field metadata", metadata);
    this.fieldsMetadataStorage.collect(metadata);
  }
  findFieldsMetadata(objectClass: ClassType): RawFieldMetadata[] | undefined {
    return this.fieldsMetadataStorage.find(objectClass);
  }

  collectResolverMetadata(metadata: RawResolverMetadata): void {
    debug("collecting resolver metadata", metadata);
    this.resolversMetadataStorage.collect(metadata);
  }
  findResolverMetadata(
    resolverClass: ClassType,
  ): RawResolverMetadata | undefined {
    return this.resolversMetadataStorage.find(resolverClass);
  }

  collectQueryMetadata(metadata: RawQueryMetadata): void {
    debug("collecting query metadata", metadata);
    this.queriesMetadataStorage.collect(metadata);
  }
  findQueriesMetadata(
    resolverClass: ClassType,
  ): RawQueryMetadata[] | undefined {
    return this.queriesMetadataStorage.find(resolverClass);
  }

  collectParameterMetadata(metadata: RawParameterMetadata): void {
    debug("collecting parameter metadata", metadata);
    this.parametersMetadataStorage.collect(metadata);
  }
  findParametersMetadata(
    resolverClass: ClassType,
    propertyKey: string | symbol,
  ): RawParameterMetadata[] | undefined {
    const resolverClassParameters = this.parametersMetadataStorage.find(
      resolverClass,
    );
    // TODO: refactor to nested maps?
    return resolverClassParameters?.filter(
      parameterMetadata => parameterMetadata.propertyKey === propertyKey,
    );
  }
}

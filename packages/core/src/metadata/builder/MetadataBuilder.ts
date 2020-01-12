import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import BuiltObjectTypeMetadata from "@src/metadata/builder/definitions/ObjectTypeMetadata";
import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import {
  getFieldTypeMetadata,
  getQueryTypeMetadata,
} from "@src/metadata/builder/type-reflection";
import MissingClassMetadataError from "@src/errors/MissingClassMetadataError";
import MissingFieldsError from "@src/errors/MissingFieldsError";
import BuiltResolverMetadata from "@src/metadata/builder/definitions/ResolverMetadata";
import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";
import MissingResolverMethodsError from "@src/errors/MissingResolverMethodsError";
import { BuildSchemaConfig } from "@src/schema/schema-config";

const debug = createDebug("@typegraphql/core:MetadataBuilder");

export default class MetadataBuilder<TContext extends object = {}> {
  private readonly typeMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltObjectTypeMetadata
  >();
  private readonly resolverMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltResolverMetadata
  >();

  constructor(protected readonly config: BuildSchemaConfig<TContext>) {
    debug("created MetadataBuilder instance", config);
  }

  getTypeMetadataByClass(typeClass: ClassType): BuiltObjectTypeMetadata {
    if (this.typeMetadataByClassMap.has(typeClass)) {
      return this.typeMetadataByClassMap.get(typeClass)!;
    }

    const objectTypeMetadata = MetadataStorage.get().findObjectTypeMetadata(
      typeClass,
    );
    if (!objectTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "ObjectType");
    }

    const objectTypeFieldsMetadata = MetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (!objectTypeFieldsMetadata || objectTypeFieldsMetadata.length === 0) {
      throw new MissingFieldsError(typeClass);
    }

    const builtObjectTypeMetadata: BuiltObjectTypeMetadata = {
      ...objectTypeMetadata,
      fields: objectTypeFieldsMetadata.map<BuiltFieldMetadata>(
        fieldMetadata => ({
          ...fieldMetadata,
          type: getFieldTypeMetadata(
            fieldMetadata,
            this.config.nullableByDefault,
          ),
        }),
      ),
    };

    this.typeMetadataByClassMap.set(typeClass, builtObjectTypeMetadata);
    return builtObjectTypeMetadata;
  }

  getResolverMetadataByClass(resolverClass: ClassType): BuiltResolverMetadata {
    if (this.resolverMetadataByClassMap.has(resolverClass)) {
      return this.resolverMetadataByClassMap.get(resolverClass)!;
    }

    const resolverMetadata = MetadataStorage.get().findResolverMetadata(
      resolverClass,
    );
    if (!resolverMetadata) {
      throw new MissingClassMetadataError(resolverClass, "Resolver");
    }

    const queriesMetadata = MetadataStorage.get().findQueriesMetadata(
      resolverClass,
    );
    // TODO: replace with a more sophisticated check - also for mutations and subscriptions
    if (!queriesMetadata || queriesMetadata.length === 0) {
      throw new MissingResolverMethodsError(resolverClass);
    }

    const builtResolverMetadata: BuiltResolverMetadata = {
      ...resolverMetadata,
      queries: queriesMetadata.map<BuiltQueryMetadata>(queryMetadata => {
        const fieldParametersMetadata = MetadataStorage.get().findParametersMetadata(
          resolverClass,
          queryMetadata.propertyKey,
        );
        return {
          ...queryMetadata,
          type: getQueryTypeMetadata(
            queryMetadata,
            this.config.nullableByDefault,
          ),
          parameters: fieldParametersMetadata,
        };
      }),
    };

    this.resolverMetadataByClassMap.set(resolverClass, builtResolverMetadata);
    return builtResolverMetadata;
  }
}

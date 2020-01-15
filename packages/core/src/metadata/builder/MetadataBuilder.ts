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
import BuiltInputTypeMetadata from "@src/metadata/builder/definitions/InputTypeMetadata";

const debug = createDebug("@typegraphql/core:MetadataBuilder");

export default class MetadataBuilder<TContext extends object = {}> {
  private readonly objectTypeMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltObjectTypeMetadata
  >();
  private readonly inputTypeMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltInputTypeMetadata
  >();
  private readonly resolverMetadataByClassMap = new WeakMap<
    ClassType,
    BuiltResolverMetadata
  >();

  constructor(protected readonly config: BuildSchemaConfig<TContext>) {
    debug("created MetadataBuilder instance", config);
  }

  getObjectTypeMetadataByClass(typeClass: ClassType): BuiltObjectTypeMetadata {
    if (this.objectTypeMetadataByClassMap.has(typeClass)) {
      return this.objectTypeMetadataByClassMap.get(typeClass)!;
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

    // TODO: refactor to a more generalized solution
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

    this.objectTypeMetadataByClassMap.set(typeClass, builtObjectTypeMetadata);
    return builtObjectTypeMetadata;
  }

  getInputTypeMetadataByClass(typeClass: ClassType): BuiltInputTypeMetadata {
    if (this.inputTypeMetadataByClassMap.has(typeClass)) {
      return this.inputTypeMetadataByClassMap.get(typeClass)!;
    }

    const inputTypeMetadata = MetadataStorage.get().findInputTypeMetadata(
      typeClass,
    );
    if (!inputTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "InputType");
    }

    const inputTypeFieldsMetadata = MetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (!inputTypeFieldsMetadata || inputTypeFieldsMetadata.length === 0) {
      throw new MissingFieldsError(typeClass);
    }

    // TODO: refactor to a more generalized solution
    const builtInputTypeMetadata: BuiltInputTypeMetadata = {
      ...inputTypeMetadata,
      fields: inputTypeFieldsMetadata.map<BuiltFieldMetadata>(
        fieldMetadata => ({
          ...fieldMetadata,
          type: getFieldTypeMetadata(
            fieldMetadata,
            this.config.nullableByDefault,
          ),
        }),
      ),
    };

    this.inputTypeMetadataByClassMap.set(typeClass, builtInputTypeMetadata);
    return builtInputTypeMetadata;
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

import createDebug from "debug";

import ClassType from "@src/interfaces/ClassType";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ObjectTypeMetadata from "@src/interfaces/metadata/ObjectTypeMetadata";
import FieldMetadata from "@src/interfaces/metadata/FieldMetadata";
import {
  getFieldTypeMetadata,
  getQueryTypeMetadata,
  getQueryParameterTypeMetadata,
} from "@src/metadata/builder/type-reflection";
import MissingClassMetadataError from "@src/errors/MissingClassMetadataError";
import MissingFieldsError from "@src/errors/MissingFieldsError";
import ResolverMetadata from "@src/interfaces/metadata/ResolverMetadata";
import QueryMetadata from "@src/interfaces/metadata/QueryMetadata";
import MissingResolverMethodsError from "@src/errors/MissingResolverMethodsError";
import { BuildSchemaConfig } from "@src/schema/schema-config";
import InputTypeMetadata from "@src/interfaces/metadata/InputTypeMetadata";
import ParamKind from "@src/interfaces/ParamKind";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";
import isTypeValueClassType from "@src/helpers/isTypeValueClassType";
import SimultaneousArgsUsageError from "@src/errors/SimultaneousArgsUsageError";
import WrongArgsTypeError from "@src/errors/WrongArgsTypeError";
import MultipleArgsUsageError from "@src/errors/MultipleArgsUsageError";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";
import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";

const debug = createDebug("@typegraphql/core:MetadataBuilder");

export default class MetadataBuilder<TContext extends object = {}> {
  private readonly objectTypeMetadataByClassMap = new WeakMap<
    ClassType,
    ObjectTypeMetadata
  >();
  private readonly inputTypeMetadataByClassMap = new WeakMap<
    ClassType,
    InputTypeMetadata
  >();
  private readonly resolverMetadataByClassMap = new WeakMap<
    ClassType,
    ResolverMetadata
  >();

  constructor(protected readonly config: BuildSchemaConfig<TContext>) {
    debug("created MetadataBuilder instance", config);
  }

  getObjectTypeMetadataByClass(typeClass: ClassType): ObjectTypeMetadata {
    if (this.objectTypeMetadataByClassMap.has(typeClass)) {
      return this.objectTypeMetadataByClassMap.get(typeClass)!;
    }

    const rawObjectTypeMetadata = RawMetadataStorage.get().findObjectTypeMetadata(
      typeClass,
    );
    if (!rawObjectTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "ObjectType");
    }

    const rawObjectTypeFieldsMetadata = RawMetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (
      !rawObjectTypeFieldsMetadata ||
      rawObjectTypeFieldsMetadata.length === 0
    ) {
      throw new MissingFieldsError(typeClass);
    }

    // TODO: refactor to a more generalized solution [1]
    const objectTypeMetadata: ObjectTypeMetadata = {
      ...rawObjectTypeMetadata,
      fields: rawObjectTypeFieldsMetadata.map<FieldMetadata>(fieldMetadata => ({
        ...fieldMetadata,
        type: getFieldTypeMetadata(
          fieldMetadata,
          this.config.nullableByDefault,
        ),
      })),
    };

    this.objectTypeMetadataByClassMap.set(typeClass, objectTypeMetadata);
    return objectTypeMetadata;
  }

  getInputTypeMetadataByClass(typeClass: ClassType): InputTypeMetadata {
    if (this.inputTypeMetadataByClassMap.has(typeClass)) {
      return this.inputTypeMetadataByClassMap.get(typeClass)!;
    }

    const rawInputTypeMetadata = RawMetadataStorage.get().findInputTypeMetadata(
      typeClass,
    );
    if (!rawInputTypeMetadata) {
      throw new MissingClassMetadataError(typeClass, "InputType");
    }

    const rawInputTypeFieldsMetadata = RawMetadataStorage.get().findFieldsMetadata(
      typeClass,
    );
    if (
      !rawInputTypeFieldsMetadata ||
      rawInputTypeFieldsMetadata.length === 0
    ) {
      throw new MissingFieldsError(typeClass);
    }

    // TODO: refactor to a more generalized solution [1]
    const inputTypeMetadata: InputTypeMetadata = {
      ...rawInputTypeMetadata,
      fields: rawInputTypeFieldsMetadata.map<FieldMetadata>(fieldMetadata => ({
        ...fieldMetadata,
        type: getFieldTypeMetadata(
          fieldMetadata,
          this.config.nullableByDefault,
        ),
      })),
    };

    this.inputTypeMetadataByClassMap.set(typeClass, inputTypeMetadata);
    return inputTypeMetadata;
  }

  getResolverMetadataByClass(resolverClass: ClassType): ResolverMetadata {
    if (this.resolverMetadataByClassMap.has(resolverClass)) {
      return this.resolverMetadataByClassMap.get(resolverClass)!;
    }

    const rawResolverMetadata = RawMetadataStorage.get().findResolverMetadata(
      resolverClass,
    );
    if (!rawResolverMetadata) {
      throw new MissingClassMetadataError(resolverClass, "Resolver");
    }

    const rawQueriesMetadata =
      RawMetadataStorage.get().findQueriesMetadata(resolverClass) ?? [];
    const rawMutationsMetadata =
      RawMetadataStorage.get().findMutationsMetadata(resolverClass) ?? [];
    // TODO: also check for subscriptions and field resolvers
    if (rawQueriesMetadata.length === 0 && rawMutationsMetadata.length === 0) {
      throw new MissingResolverMethodsError(resolverClass);
    }

    const resolverMetadata: ResolverMetadata = {
      ...rawResolverMetadata,
      // TODO: refactor to a more generalized solution [2]
      queries: rawQueriesMetadata.map<QueryMetadata>(rawQueryMetadata => {
        const rawQueryParametersMetadata =
          RawMetadataStorage.get().findParametersMetadata(
            resolverClass,
            rawQueryMetadata.propertyKey,
          ) ?? [];
        this.checkArgsParametersUsage(
          rawQueryParametersMetadata,
          rawQueryMetadata,
        );
        return {
          ...rawQueryMetadata,
          type: getQueryTypeMetadata(
            rawQueryMetadata,
            this.config.nullableByDefault,
          ),
          parameters: this.buildParametersMetadata(rawQueryParametersMetadata),
        };
      }),
      // TODO: refactor to a more generalized solution [2]
      mutations: rawMutationsMetadata.map<QueryMetadata>(
        rawMutationMetadata => {
          const rawQueryParametersMetadata =
            RawMetadataStorage.get().findParametersMetadata(
              resolverClass,
              rawMutationMetadata.propertyKey,
            ) ?? [];
          this.checkArgsParametersUsage(
            rawQueryParametersMetadata,
            rawMutationMetadata,
          );
          return {
            ...rawMutationMetadata,
            type: getQueryTypeMetadata(
              rawMutationMetadata,
              this.config.nullableByDefault,
            ),
            parameters: this.buildParametersMetadata(
              rawQueryParametersMetadata,
            ),
          };
        },
      ),
    };

    this.resolverMetadataByClassMap.set(resolverClass, resolverMetadata);
    return resolverMetadata;
  }

  private buildParametersMetadata(
    rawParametersMetadata: RawParameterMetadata[],
  ): ParameterMetadata[] {
    return rawParametersMetadata.map<ParameterMetadata>(
      rawParameterMetadata => {
        switch (rawParameterMetadata.kind) {
          case ParamKind.SingleArg: {
            return {
              ...rawParameterMetadata,
              type: getQueryParameterTypeMetadata(
                rawParameterMetadata,
                this.config.nullableByDefault,
              ),
            };
          }
          case ParamKind.SpreadArgs: {
            const type = getQueryParameterTypeMetadata(
              rawParameterMetadata,
              this.config.nullableByDefault,
            );
            if (
              !isTypeValueClassType(type.value) ||
              type.modifiers.listDepth > 0
            ) {
              throw new WrongArgsTypeError(rawParameterMetadata);
            }
            return {
              ...rawParameterMetadata,
              type,
            };
          }
          default:
            return rawParameterMetadata;
        }
      },
    );
  }

  private checkArgsParametersUsage(
    rawParametersMetadata: RawParameterMetadata[],
    metadata: TargetClassMetadata & PropertyMetadata,
  ): void {
    const spreadArgsMetadataLength = rawParametersMetadata.filter(
      it => it.kind === ParamKind.SpreadArgs,
    ).length;
    if (spreadArgsMetadataLength > 1) {
      throw new MultipleArgsUsageError(metadata);
    }
    const singleArgMetadataLength = rawParametersMetadata.filter(
      it => it.kind === ParamKind.SingleArg,
    ).length;
    if (spreadArgsMetadataLength && singleArgMetadataLength) {
      throw new SimultaneousArgsUsageError(metadata);
    }
  }
}

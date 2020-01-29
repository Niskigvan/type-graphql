import RawFieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeInfo } from "@src/interfaces/metadata/TypeMetadata";
import {
  PropertyMetadata,
  TargetMetadata,
  ExplicitTypeMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";
import TypeValue from "@src/interfaces/TypeValue";
import { ExplicitTypeFnValue } from "@src/interfaces/ExplicitTypeFn";
import MissingExplicitTypeError from "@src/errors/MissingExplicitTypeError";
import RawQueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";

const bannedReflectedTypes: Function[] = [Promise, Array, Object, Function];

function getReflectedPropertyType(
  metadata: PropertyMetadata & TargetMetadata,
): Function | undefined {
  return Reflect.getMetadata(
    "design:type",
    metadata.target.prototype,
    metadata.propertyKey,
  );
}
function getReflectedMethodType(
  metadata: PropertyMetadata & TargetMetadata,
): Function | undefined {
  return Reflect.getMetadata(
    "design:returntype",
    metadata.target.prototype,
    metadata.propertyKey,
  );
}

function unwrapExplicitType(
  explicitTypeFromFn: ExplicitTypeFnValue | undefined,
): { explicitType: TypeValue | undefined; listDepth: number } {
  let listDepth = 0;
  let currentTupleItem = explicitTypeFromFn;
  while (Array.isArray(currentTupleItem)) {
    listDepth++;
    currentTupleItem = currentTupleItem[0];
  }
  return { explicitType: currentTupleItem, listDepth };
}

function getTypeMetadata(
  metadata: TargetMetadata &
    PropertyMetadata &
    ExplicitTypeMetadata &
    NullableMetadata &
    Partial<RawParameterMetadata>,
  nullableByDefault: boolean,
  reflectedType: Function | undefined,
): TypeInfo {
  const { explicitType, listDepth } = unwrapExplicitType(
    metadata.explicitTypeFn?.(),
  );
  if (
    !explicitType &&
    (!reflectedType || bannedReflectedTypes.includes(reflectedType))
  ) {
    throw new MissingExplicitTypeError(metadata, reflectedType);
  }

  return {
    value: (explicitType ?? reflectedType) as TypeValue,
    modifiers: {
      listDepth,
      nullable: metadata.nullable ?? nullableByDefault,
    },
  };
}

export function getFieldTypeMetadata(
  fieldMetadata: RawFieldMetadata,
  nullableByDefault: boolean,
): TypeInfo {
  const reflectedType = getReflectedPropertyType(fieldMetadata);
  return getTypeMetadata(fieldMetadata, nullableByDefault, reflectedType);
}

export function getQueryTypeMetadata(
  queryMetadata: RawQueryMetadata,
  nullableByDefault: boolean,
): TypeInfo {
  const reflectedType = getReflectedMethodType(queryMetadata);
  return getTypeMetadata(queryMetadata, nullableByDefault, reflectedType);
}

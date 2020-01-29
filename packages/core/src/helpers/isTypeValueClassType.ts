import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from "graphql";

import TypeValue from "@src/interfaces/TypeValue";
import ClassType from "@src/interfaces/ClassType";

const primitiveTypesConstructors: Function[] = [String, Number, Boolean];

export default function isTypeValueClassType(
  typeValue: TypeValue,
): typeValue is ClassType {
  if (
    typeValue instanceof GraphQLScalarType ||
    typeValue instanceof GraphQLObjectType ||
    typeValue instanceof GraphQLInputObjectType ||
    typeof typeValue == "object" ||
    typeof typeValue == "symbol" ||
    primitiveTypesConstructors.includes(typeValue)
  ) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _typeGuard: ClassType = typeValue;
  return true;
}

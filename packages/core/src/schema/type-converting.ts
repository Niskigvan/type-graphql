import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLList,
} from "graphql";
import { TypeModifiers } from "@src/interfaces/metadata/TypeMetadata";

export function convertTypeIfScalar(
  type: unknown,
): GraphQLScalarType | undefined {
  if (type instanceof GraphQLScalarType) {
    return type;
  }

  switch (type) {
    case String:
      return GraphQLString;
    case Boolean:
      return GraphQLBoolean;
    case Number:
      return GraphQLFloat;
    default:
      return undefined;
  }
}

type WrappedGraphQLType<TGraphQLType extends GraphQLNullableType> =
  | TGraphQLType
  | GraphQLNonNull<TGraphQLType>
  | GraphQLList<TGraphQLType>;

export function wrapWithModifiers<TGraphQLType extends GraphQLNullableType>(
  baseType: TGraphQLType,
  modifiers: TypeModifiers,
): WrappedGraphQLType<TGraphQLType> {
  let graphQLType: WrappedGraphQLType<TGraphQLType> = baseType;
  if (modifiers.listDepth > 0) {
    graphQLType = new GraphQLList(
      wrapWithModifiers(graphQLType, {
        ...modifiers,
        listDepth: modifiers.listDepth - 1,
      }),
    ) as GraphQLList<TGraphQLType>;
  }
  if (modifiers.nullable === false) {
    graphQLType = new GraphQLNonNull(graphQLType) as GraphQLNonNull<
      TGraphQLType
    >;
  }
  return graphQLType;
}

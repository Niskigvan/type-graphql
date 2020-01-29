import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from "graphql";

import ClassType from "@src/interfaces/ClassType";

type SupportedGraphQLArtifacts =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInputObjectType;

type TypeValue = ClassType | SupportedGraphQLArtifacts | object | symbol; // enum | union

export default TypeValue;

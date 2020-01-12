import { GraphQLSchema } from "graphql";
import { BuildSchemaOptions, buildSchema } from "@typegraphql/core";

import TestResolver from "@tests/helpers/TestResolver";

export default async function buildTestSchema(
  options: Partial<BuildSchemaOptions>,
): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [TestResolver, ...(options.resolvers ?? [])],
    ...options,
  });
}

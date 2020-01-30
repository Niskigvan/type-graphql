import { printType } from "graphql";

import { ClassType, buildSchema, BuildSchemaOptions } from "@typegraphql/core";
import TestResolver from "@tests/helpers/TestResolver";

export default async function getPrintedMutation(
  ResolverClass: ClassType,
  options?: Omit<BuildSchemaOptions, "resolvers">,
): Promise<string> {
  const schema = await buildSchema({
    ...options,
    resolvers: [TestResolver, ResolverClass],
  });
  const type = schema.getMutationType()!;
  return printType(type);
}

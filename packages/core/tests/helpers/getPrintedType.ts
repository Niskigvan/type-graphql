import { printType } from "graphql";

import { ClassType, buildSchema, BuildSchemaOptions } from "@typegraphql/core";
import TestResolver from "@tests/helpers/TestResolver";

export default async function getPrintedType(
  typeClass: ClassType,
  typeName = typeClass.name,
  options?: Omit<BuildSchemaOptions, "resolvers" | "orphanedTypes">,
): Promise<string> {
  const schema = await buildSchema({
    orphanedTypes: [typeClass],
    resolvers: [TestResolver],
    ...options,
  });
  const type = schema.getType(typeName)!;
  return printType(type);
}

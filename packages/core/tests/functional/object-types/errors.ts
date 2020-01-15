import "reflect-metadata";
import { ObjectType, MissingFieldsError } from "@typegraphql/core";

import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("Object types > errors", () => {
  it("should throw an error if the object type has no fields registered", async () => {
    expect.assertions(2);
    @ObjectType()
    class SampleObject {
      sampleField!: string;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingFieldsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find any fields metadata for type class 'SampleObject' in storage. Are the properties annotated with a '@Field()' decorator?"`,
      );
    }
  });
});

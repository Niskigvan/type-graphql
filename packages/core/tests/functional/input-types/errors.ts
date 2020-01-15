import "reflect-metadata";
import { InputType, MissingFieldsError } from "@typegraphql/core";

import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("Input types > errors", () => {
  it("should throw an error if the input type has no fields registered", async () => {
    expect.assertions(2);
    @InputType()
    class SampleInput {
      sampleField!: string;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleInput],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingFieldsError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find any fields metadata for type class 'SampleInput' in storage. Are the properties annotated with a '@Field()' decorator?"`,
      );
    }
  });
});

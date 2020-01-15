import "reflect-metadata";
import {
  ObjectType,
  Field,
  MissingClassMetadataError,
} from "@typegraphql/core";

import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("buildSchema > errors", () => {
  it("should throw an error if an undecorated class is provided as orphanedTypes", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    try {
      await buildTestSchema({
        orphanedTypes: [SampleObject, UnknownClass],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingClassMetadataError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot find metadata for class 'UnknownClass' in storage. Is it annotated with a TypeGraphQL decorator?"`,
      );
    }
  });
});

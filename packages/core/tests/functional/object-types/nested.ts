import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Object types > nested", () => {
  it("should generate schema signature with object type field for nested Object Type", async () => {
    @ObjectType()
    class NestedObject {
      @Field()
      sampleField!: string;
    }
    @ObjectType()
    class SampleObject {
      @Field()
      nestedField!: NestedObject;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        nestedField: NestedObject!
      }"
    `);
  });
});

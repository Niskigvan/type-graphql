import "reflect-metadata";

import { InputType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Input types > nested", () => {
  it("should generate schema signature with input type field for nested Input Object Type", async () => {
    @InputType()
    class NestedInput {
      @Field()
      sampleField!: string;
    }
    @InputType()
    class SampleInput {
      @Field()
      nestedField!: NestedInput;
    }

    const printedSampleInputType = await getPrintedType(SampleInput);

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "input SampleInput {
        nestedField: NestedInput!
      }"
    `);
  });
});

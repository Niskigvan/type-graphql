import "reflect-metadata";

import { InputType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Input types > base", () => {
  it("should generate schema signature with fields for basic Input Object Type", async () => {
    @InputType()
    class SampleInput {
      @Field(_type => String)
      sampleField!: string;
    }

    const printedSampleInputType = await getPrintedType(SampleInput);

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "input SampleInput {
        sampleField: String!
      }"
    `);
  });
});

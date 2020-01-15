import "reflect-metadata";

import { InputType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Input types > options", () => {
  it("should correctly generate type name using `schemaName` decorator option", async () => {
    @InputType({ schemaName: "SampleInputSchemaName" })
    class SampleInput {
      @Field(_type => String)
      sampleField!: string;
    }

    const printedSampleInputType = await getPrintedType(
      SampleInput,
      "SampleInputSchemaName",
    );

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "input SampleInputSchemaName {
        sampleField: String!
      }"
    `);
  });

  it("should correctly generate type description using `description` decorator option", async () => {
    @InputType({ description: "SampleInput description" })
    class SampleInput {
      @Field(_type => String)
      sampleField!: string;
    }

    const printedSampleInputType = await getPrintedType(SampleInput);

    expect(printedSampleInputType).toMatchInlineSnapshot(`
      "\\"\\"\\"SampleInput description\\"\\"\\"
      input SampleInput {
        sampleField: String!
      }"
    `);
  });
});

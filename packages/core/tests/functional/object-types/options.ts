import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Object types > options", () => {
  it("should correctly generate type name using `schemaName` decorator option", async () => {
    @ObjectType({ schemaName: "SampleObjectSchemaName" })
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(
      SampleObject,
      "SampleObjectSchemaName",
    );

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObjectSchemaName {
        sampleField: String!
      }"
    `);
  });

  it("should correctly generate type description using `description` decorator option", async () => {
    @ObjectType({ description: "SampleObject description" })
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "\\"\\"\\"SampleObject description\\"\\"\\"
      type SampleObject {
        sampleField: String!
      }"
    `);
  });
});

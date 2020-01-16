import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("@Field options", () => {
  it("should correctly generate field name in schema using `schemaName` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field({ schemaName: "sampleFieldSchemaName" })
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleFieldSchemaName: String!
      }"
    `);
  });

  it("should correctly generate field description in schema using `description` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field({ description: "Field description" })
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        \\"\\"\\"Field description\\"\\"\\"
        sampleField: String!
      }"
    `);
  });
});

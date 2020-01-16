import "reflect-metadata";

import { ObjectType, Field } from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Fields types > nullable", () => {
  it("should correctly generate nullable field in schema using `nullable: true` decorator option", async () => {
    @ObjectType()
    class SampleObject {
      @Field({ nullable: true })
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String
      }"
    `);
  });

  it("should correctly generate nullable field in schema using `nullableByDefault: true` build schema option", async () => {
    @ObjectType()
    class SampleObject {
      @Field()
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(
      SampleObject,
      undefined,
      { nullableByDefault: true },
    );

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String
      }"
    `);
  });

  it("should correctly generate not nullable field in schema when `nullableByDefault: true` and `nullable: false`", async () => {
    @ObjectType()
    class SampleObject {
      @Field({ nullable: false })
      sampleField!: string;
    }

    const printedSampleObjectType = await getPrintedType(
      SampleObject,
      undefined,
      { nullableByDefault: true },
    );

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should generate proper field signature in schema for nullable string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [String], { nullable: true })
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [String]
      }"
    `);
  });

  it("should generate proper field signature in schema for nullable nested string array type", async () => {
    @ObjectType()
    class SampleObject {
      @Field(_type => [[[String]]], { nullable: true })
      sampleField!: unknown;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: [[[String]]]
      }"
    `);
  });
});

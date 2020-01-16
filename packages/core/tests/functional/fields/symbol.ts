import "reflect-metadata";

import {
  ObjectType,
  Field,
  MissingSymbolKeyDescriptionError,
} from "@typegraphql/core";
import getPrintedType from "@tests/helpers/getPrintedType";

describe("Fields types > symbol", () => {
  it("should correctly generate schema field name when symbol is used as property key", async () => {
    const sampleFieldSymbol = Symbol("sampleField");
    @ObjectType()
    class SampleObject {
      @Field()
      [sampleFieldSymbol]!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should correctly generate schema field name when symbol without description is used as property key but schemaName provided", async () => {
    const sampleFieldSymbol = Symbol();
    @ObjectType()
    class SampleObject {
      @Field({ schemaName: "sampleField" })
      [sampleFieldSymbol]!: string;
    }

    const printedSampleObjectType = await getPrintedType(SampleObject);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type SampleObject {
        sampleField: String!
      }"
    `);
  });

  it("should throw error when symbol without description is used as property key", async () => {
    expect.assertions(2);
    try {
      const sampleFieldSymbol = Symbol();
      @ObjectType()
      class SampleObject {
        @Field()
        [sampleFieldSymbol]!: string;
      }
      await getPrintedType(SampleObject);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingSymbolKeyDescriptionError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected symbol key without a description. Please check the properties or methods of class 'SampleObject' and provide a proper symbol description or add a \`schemaName\` decorator option e.g. \`@Field({ schemaName: \\"nameOfSymbolField\\" })\`."`,
      );
    }
  });
});

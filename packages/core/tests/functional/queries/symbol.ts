import "reflect-metadata";

import {
  MissingSymbolKeyDescriptionError,
  Resolver,
  Query,
} from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries > symbol", () => {
  it("should correctly generate schema query name when symbol is used as method key", async () => {
    const sampleQuerySymbol = Symbol("sampleQuery");
    @Resolver()
    class SampleResolver {
      @Query()
      [sampleQuerySymbol](): string {
        return "sampleQuerySymbol";
      }
    }

    const printedSampleObjectType = await getPrintedQuery(SampleResolver);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should correctly generate schema query name when symbol without description is used as method key but schemaName provided", async () => {
    const sampleQuerySymbol = Symbol();
    @Resolver()
    class SampleResolver {
      @Query({ schemaName: "sampleQuery" })
      [sampleQuerySymbol](): string {
        return "sampleQuerySymbol";
      }
    }

    const printedSampleObjectType = await getPrintedQuery(SampleResolver);

    expect(printedSampleObjectType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should throw error when symbol without description is used as method key", async () => {
    expect.assertions(2);
    try {
      const sampleQuerySymbol = Symbol();
      @Resolver()
      class SampleResolver {
        @Query()
        [sampleQuerySymbol](): string {
          return "sampleQuerySymbol";
        }
      }
      await getPrintedQuery(SampleResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingSymbolKeyDescriptionError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected symbol key without a description. Please check the properties or methods of class 'SampleResolver' and provide a proper symbol description or add a \`schemaName\` decorator option e.g. \`@Field({ schemaName: \\"nameOfSymbolField\\" })\`."`,
      );
    }
  });
});

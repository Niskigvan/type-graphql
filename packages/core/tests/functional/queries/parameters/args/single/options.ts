import "reflect-metadata";
import { Resolver, Query, Args } from "@typegraphql/core";

import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("parameters > args > single > options", () => {
  it("should emit single inline arg with description", async () => {
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args("testArg", { description: "testArgDescription" })
        _testArg: string,
      ): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(
          \\"\\"\\"testArgDescription\\"\\"\\"
          testArg: String!
        ): String!
      }"
    `);
  });

  it("should emit single inline nullable arg", async () => {
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args("testArg", { nullable: true })
        _testArg?: string,
      ): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(testArg: String): String!
      }"
    `);
  });

  it("should use explicit type from `@Args` decorator if no reflected type available", async () => {
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args("testArg", { typeFn: () => Boolean })
        _testArg: unknown,
      ): string {
        return "testQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(TestResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        testQuery(testArg: Boolean!): String!
      }"
    `);
  });
});

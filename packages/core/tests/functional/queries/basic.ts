import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import { Resolver, Query, buildSchema } from "@typegraphql/core";
import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("Queries > basic", () => {
  it("should generate proper schema signature for basic resolver with query", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }

    const printedQueryType = await getPrintedQuery(SampleResolver);

    expect(printedQueryType).toMatchInlineSnapshot(`
      "type Query {
        sampleQuery: String!
      }"
    `);
  });

  it("should execute resolver class method for basic query", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQueryReturnedValue";
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;

    const schema = await buildSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleQuery": "sampleQueryReturnedValue",
        },
      }
    `);
  });

  it("should execute resolver class async method for query", async () => {
    @Resolver()
    class SampleResolver {
      @Query(_returns => String)
      async sampleQuery(): Promise<string> {
        await new Promise(setImmediate);
        return "asyncSampleQueryReturnedValue";
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;

    const schema = await buildSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleQuery": "asyncSampleQueryReturnedValue",
        },
      }
    `);
  });
});

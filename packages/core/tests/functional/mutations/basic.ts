import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import { Resolver, Mutation } from "@typegraphql/core";
import getPrintedMutation from "@tests/helpers/getPrintedMutation";
import buildTestSchema from "@tests/helpers/buildTestSchema";

describe("Mutations > basic", () => {
  it("should generate proper schema signature for basic resolver with mutation", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(): string {
        return "sampleMutation";
      }
    }

    const printedMutationType = await getPrintedMutation(SampleResolver);

    expect(printedMutationType).toMatchInlineSnapshot(`
      "type Mutation {
        sampleMutation: String!
      }"
    `);
  });

  it("should execute resolver class method for mutation", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation()
      sampleMutation(): string {
        return "sampleMutationReturnedValue";
      }
    }
    const document = gql`
      mutation {
        sampleMutation
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleMutation": "sampleMutationReturnedValue",
        },
      }
    `);
  });

  it("should execute resolver class async method for mutation", async () => {
    @Resolver()
    class SampleResolver {
      @Mutation(_returns => String)
      async sampleMutation(): Promise<string> {
        await new Promise(setImmediate);
        return "asyncSampleMutationReturnedValue";
      }
    }
    const document = gql`
      mutation {
        sampleMutation
      }
    `;

    const schema = await buildTestSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "sampleMutation": "asyncSampleMutationReturnedValue",
        },
      }
    `);
  });
});

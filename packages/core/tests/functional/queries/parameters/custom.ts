import "reflect-metadata";
import gql from "graphql-tag";
import { execute } from "graphql";

import {
  Resolver,
  Query,
  buildSchema,
  createParamDecorator,
  ParameterResolver,
} from "@typegraphql/core";

describe("Queries > parameters > custom", () => {
  it("should inject async parameter to query handler from custom parameter resolver ", async () => {
    function TestParam(): ParameterDecorator {
      return createParamDecorator(
        class TestParamResolver implements ParameterResolver {
          async resolve(): Promise<number> {
            await new Promise(setImmediate);
            return Math.PI;
          }
        },
      );
    }

    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@TestParam() testValue: number): number {
        return testValue;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;

    const schema = await buildSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document });

    expect(result.errors).toBeUndefined();
    expect(result.data?.sampleQuery).toBe(Math.PI);
  });
});

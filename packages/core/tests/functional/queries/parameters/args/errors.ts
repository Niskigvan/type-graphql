import "reflect-metadata";
import {
  Query,
  Args,
  Resolver,
  InputType,
  Field,
  SimultaneousArgsUsageError,
} from "@typegraphql/core";

import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("parameters > args > errors", () => {
  it("should throw error when `@Args()` is used as spread and single arg at the same time", async () => {
    expect.assertions(2);
    @InputType()
    class TestArgs {
      @Field()
      testField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args() _spreadArgs: TestArgs,
        @Args("singleArg") _singleArg: string,
      ): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(SimultaneousArgsUsageError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected simultaneous usage of '@Args()' and '@Args(\\"argName\\")' decorators as parameters of TestResolver#testQuery method. You need to embed the single arg as the field of the '@InputType' class."`,
      );
    }
  });
});

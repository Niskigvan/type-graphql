import "reflect-metadata";
import {
  Query,
  Args,
  Resolver,
  MissingExplicitTypeError,
  MissingClassMetadataError,
  InputType,
  Field,
  WrongArgsTypeError,
  MultipleArgsUsageError,
} from "@typegraphql/core";

import getPrintedQuery from "@tests/helpers/getPrintedQuery";

describe("parameters > args > spread > errors", () => {
  it("should throw error when unknown type is provided as TS type", async () => {
    expect.assertions(2);
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args() _testArg: unknown): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingExplicitTypeError);
      expect(error.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for parameter #0 of TestResolver#testQuery in decorator option, e.g. \`@Args(\\"myArg\\", { typeFn: () => [String] })\`."`,
      );
    }
  });

  it("should throw error when `@Args()` is used twice with input type class", async () => {
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
        @Args() _testArg1: TestArgs,
        @Args() _testArg2: TestArgs,
      ): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MultipleArgsUsageError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected multiple '@Args()' decorators as parameters of TestResolver#testQuery method. You can only use single '@Args()' parameter pointing to an '@InputType' class at the same time."`,
      );
    }
  });

  it("should throw error when unknown class is used instead of `@InputType` class", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: unknown;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args() _testArg: UnknownClass): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(MissingClassMetadataError);
      expect(error.message).toMatchInlineSnapshot(
        `"Cannot find metadata for class 'UnknownClass' in storage. Is it annotated with the '@InputType' decorator?"`,
      );
    }
  });

  it("should throw error when not a class type is provided as the arg type", async () => {
    expect.assertions(2);
    const testSymbol = Symbol("test");
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(
        @Args({ typeFn: () => testSymbol }) _testArg1: unknown,
      ): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(WrongArgsTypeError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected wrong type for '@Args()' parameter #0 of TestResolver#testQuery method. '@Args()' parameter has to be used with the '@InputType' class as its type."`,
      );
    }
  });

  it("should throw error when primitive type is used as a TS type", async () => {
    expect.assertions(2);
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args() _testArg: string): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(WrongArgsTypeError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected wrong type for '@Args()' parameter #0 of TestResolver#testQuery method. '@Args()' parameter has to be used with the '@InputType' class as its type."`,
      );
    }
  });

  it("should throw error when array of input type is used as args type", async () => {
    expect.assertions(2);
    @InputType()
    class TestArgs {
      @Field()
      testField!: string;
    }
    @Resolver()
    class TestResolver {
      @Query()
      testQuery(@Args({ typeFn: () => [TestArgs] }) _testArg: unknown): string {
        return "testQuery";
      }
    }
    try {
      await getPrintedQuery(TestResolver);
    } catch (error) {
      expect(error).toBeInstanceOf(WrongArgsTypeError);
      expect(error.message).toMatchInlineSnapshot(
        `"Detected wrong type for '@Args()' parameter #0 of TestResolver#testQuery method. '@Args()' parameter has to be used with the '@InputType' class as its type."`,
      );
    }
  });
});

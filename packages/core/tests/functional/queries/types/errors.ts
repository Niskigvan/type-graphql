import "reflect-metadata";
import {
  MissingExplicitTypeError,
  CannotDetermineOutputTypeError,
  ConflictingExplicitTypeOptions,
  Query,
  buildSchema,
  Resolver,
} from "@typegraphql/core";

describe("Queries return types > errors", () => {
  it("should throw an error if an undecorated class is used as an explicit return type", async () => {
    expect.assertions(2);
    class UnknownClass {
      unknownField!: string;
    }
    @Resolver()
    class SampleResolver {
      @Query(_returns => UnknownClass)
      sampleQuery(): unknown {
        return null;
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(CannotDetermineOutputTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot determine GraphQL output type 'UnknownClass' of SampleResolver#sampleQuery!"`,
      );
    }
  });

  it("should throw an error if Array is used as a reflected return type", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string[] {
        return [];
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Array'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if Promise is used as a reflected return type", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Query()
      async sampleQuery(): Promise<string> {
        await new Promise(setImmediate);
        return "sampleQuery";
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Promise'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if interface is used as a reflected return type", async () => {
    expect.assertions(2);
    interface UnknownType {
      unknownField: string;
    }
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): UnknownType {
        return {} as UnknownType;
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if TS union type is used as a reflected return type", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string | null {
        return null;
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error if `any` type is used as a reflected return type", async () => {
    expect.assertions(2);
    @Resolver()
    class SampleResolver {
      @Query()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sampleQuery(): any {
        return null;
      }
    }

    try {
      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingExplicitTypeError);
      expect(err.message).toMatchInlineSnapshot(
        `"Cannot transform reflected type 'Object'. You need to provide an explicit type for SampleResolver#sampleQuery in decorator option, e.g. \`@Field(type => MyType)\`."`,
      );
    }
  });

  it("should throw an error when using `typeFn` both as parameter and as option", async () => {
    expect.assertions(2);

    try {
      @Resolver()
      class SampleResolver {
        @Query(_returns => String, { typeFn: () => String })
        sampleQuery(): unknown {
          return "sampleQuery";
        }
      }

      await buildSchema({
        resolvers: [SampleResolver],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictingExplicitTypeOptions);
      expect(err.message).toMatchInlineSnapshot(
        `"Conflicting explicit type options for SampleResolver#sampleQuery. You can provide the explicit type only as a parameter or as an options object property at the same time."`,
      );
    }
  });
});

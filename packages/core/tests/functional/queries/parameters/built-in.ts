import "reflect-metadata";
import gql from "graphql-tag";
import { execute, GraphQLResolveInfo } from "graphql";

import {
  Resolver,
  Query,
  buildSchema,
  Source,
  Context,
  Info,
} from "@typegraphql/core";

describe("Queries > parameters > built-in", () => {
  it("should inject source resolver data property to query handler when `@Source()` decorator is used", async () => {
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Source() source: number): number {
        return source;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const rootValue = Math.PI;

    const schema = await buildSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document, rootValue });

    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchInlineSnapshot(`
      Object {
        "sampleQuery": 3.141592653589793,
      }
    `);
  });

  it("should inject GraphQL context to query handler when `@Context()` decorator is used", async () => {
    interface TestContext {
      pi: number;
    }
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Context() context: TestContext): number {
        return context.pi;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const contextValue: TestContext = { pi: Math.PI };

    const schema = await buildSchema({ resolvers: [SampleResolver] });
    const result = await execute({ schema, document, contextValue });

    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchInlineSnapshot(`
      Object {
        "sampleQuery": 3.141592653589793,
      }
    `);
  });

  it("should inject GraphQL info to query handler when `@Info()` decorator is used", async () => {
    let resolveInfo!: GraphQLResolveInfo;
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(@Info() info: GraphQLResolveInfo): boolean {
        resolveInfo = info;
        return true;
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
    expect(result.data?.sampleQuery).toBeTrue();
    expect(resolveInfo).toMatchInlineSnapshot(`
      Object {
        "fieldName": "sampleQuery",
        "fieldNodes": Array [
          Object {
            "alias": undefined,
            "arguments": Array [],
            "directives": Array [],
            "kind": "Field",
            "name": Object {
              "kind": "Name",
              "value": "sampleQuery",
            },
            "selectionSet": undefined,
          },
        ],
        "fragments": Object {},
        "operation": Object {
          "directives": Array [],
          "kind": "OperationDefinition",
          "name": undefined,
          "operation": "query",
          "selectionSet": Object {
            "kind": "SelectionSet",
            "selections": Array [
              Object {
                "alias": undefined,
                "arguments": Array [],
                "directives": Array [],
                "kind": "Field",
                "name": Object {
                  "kind": "Name",
                  "value": "sampleQuery",
                },
                "selectionSet": undefined,
              },
            ],
          },
          "variableDefinitions": Array [],
        },
        "parentType": "Query",
        "path": Object {
          "key": "sampleQuery",
          "prev": undefined,
        },
        "returnType": "Boolean!",
        "rootValue": undefined,
        "schema": GraphQLSchema {
          "__allowedLegacyNames": Array [],
          "__validationErrors": Array [],
          "_directives": Array [
            "@include",
            "@skip",
            "@deprecated",
          ],
          "_implementations": Object {},
          "_mutationType": undefined,
          "_possibleTypeMap": Object {},
          "_queryType": "Query",
          "_subscriptionType": undefined,
          "_typeMap": Object {
            "Boolean": "Boolean",
            "Query": "Query",
            "String": "String",
            "__Directive": "__Directive",
            "__DirectiveLocation": "__DirectiveLocation",
            "__EnumValue": "__EnumValue",
            "__Field": "__Field",
            "__InputValue": "__InputValue",
            "__Schema": "__Schema",
            "__Type": "__Type",
            "__TypeKind": "__TypeKind",
          },
          "astNode": undefined,
          "extensionASTNodes": undefined,
          "extensions": undefined,
        },
        "variableValues": Object {},
      }
    `);
  });
});

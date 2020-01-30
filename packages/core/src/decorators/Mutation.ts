import TypedMethodDecorator from "@src/interfaces/TypedMethodDecorator";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import {
  Nameable,
  ExplicitTypeable,
  Descriptionable,
  Nullable,
} from "@src/decorators/types";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  parseDecoratorParameters,
  getSchemaName,
} from "@src/decorators/helpers";
import ClassType from "@src/interfaces/ClassType";

export interface MutationOptions
  extends Nameable,
    Descriptionable,
    Nullable,
    ExplicitTypeable {}

/**
 * Decorator used to register the class method
 * as a field of "Mutation" object type in GraphQL schema, e.g.:
 *
 * ```graphql
 * type Mutation {
 *  myMethod: SomeType!
 * }
 * ```
 */
export default function Mutation(
  options?: MutationOptions,
): TypedMethodDecorator;
export default function Mutation(
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Mutation(returns => [String])`
   */
  explicitTypeFn: ExplicitTypeFn,
  options?: MutationOptions,
): TypedMethodDecorator;
export default function Mutation(
  maybeExplicitTypeFnOrOptions?: ExplicitTypeFn | MutationOptions,
  maybeOptions?: MutationOptions,
): TypedMethodDecorator {
  return (prototype, propertyKey) => {
    const targetClass = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    const { explicitTypeFn, options = {} } = parseDecoratorParameters(
      maybeExplicitTypeFnOrOptions,
      maybeOptions,
      {
        targetClass,
        propertyKey,
      },
    );
    RawMetadataStorage.get().collectMutationMetadata({
      targetClass,
      propertyKey,
      schemaName: getSchemaName(options, propertyKey, { targetClass }),
      description: options.description,
      nullable: options.nullable,
      explicitTypeFn,
    });
  };
}

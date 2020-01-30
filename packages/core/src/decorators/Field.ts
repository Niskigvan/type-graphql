import TypedPropertyDecorator from "@src/interfaces/TypedPropertyDecorator";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  parseDecoratorParameters,
  getSchemaName,
} from "@src/decorators/helpers";
import {
  Nameable,
  Descriptionable,
  Nullable,
  ExplicitTypeable,
} from "@src/decorators/types";
import ClassType from "@src/interfaces/ClassType";

export interface FieldOptions
  extends Nameable,
    Descriptionable,
    Nullable,
    ExplicitTypeable {}

/**
 * Decorator used to register the class property
 * as an field of ObjectType or InputType in GraphQL schema, e.g.:
 *
 * ```graphql
 * type MyClass {
 *  myProperty: SomeType!
 * }
 * ```
 */
export default function Field(options?: FieldOptions): TypedPropertyDecorator;
export default function Field(
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Field(type => [String])`
   */
  explicitTypeFn: ExplicitTypeFn,
  options?: FieldOptions,
): TypedPropertyDecorator;
export default function Field(
  maybeExplicitTypeFnOrOptions?: ExplicitTypeFn | FieldOptions,
  maybeOptions?: FieldOptions,
): TypedPropertyDecorator {
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
    RawMetadataStorage.get().collectFieldMetadata({
      targetClass,
      propertyKey,
      schemaName: getSchemaName(options, propertyKey, { targetClass }),
      description: options.description,
      nullable: options.nullable,
      explicitTypeFn,
    });
  };
}

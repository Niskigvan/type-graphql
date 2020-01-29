import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import { Nameable, Descriptionable } from "@src/decorators/types";

export interface InputTypeOptions extends Nameable, Descriptionable {}

/**
 * Decorator used to register the class as an Input Object Type in GraphQL schema, e.g.:
 *
 * ```graphql
 * input MyClass {
 *  myProperty: SomeType!
 * }
 * ```
 */
export default function InputType(
  options: InputTypeOptions = {},
): TypedClassDecorator {
  return target => {
    RawMetadataStorage.get().collectInputTypeMetadata({
      target,
      schemaName: options.schemaName ?? target.name,
      description: options.description,
    });
  };
}

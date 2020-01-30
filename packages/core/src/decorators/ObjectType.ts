import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import ClassType from "@src/interfaces/ClassType";
import { Nameable, Descriptionable } from "@src/decorators/types";

export interface ObjectTypeOptions extends Nameable, Descriptionable {
  /**
   * An array of `@InterfaceType` classes that the Object Type will implement
   * in the emitted GraphQL schema, e.g.:
   *
   * ```graphql
   * type SampleType implements MyInterface {}
   * ```
   */
  implements?: ClassType | ClassType[];
}

/**
 * Decorator used to register the class as an Object Type in GraphQL schema, e.g.:
 *
 * ```graphql
 * type MyClass {
 *  myProperty: SomeType!
 * }
 * ```
 */
export default function ObjectType(
  options: ObjectTypeOptions = {},
): TypedClassDecorator {
  const implementedInterfaceClasses: ClassType[] = [];
  if (options.implements) {
    implementedInterfaceClasses.concat(options.implements);
  }

  return targetClass => {
    RawMetadataStorage.get().collectObjectTypeMetadata({
      targetClass,
      schemaName: options.schemaName ?? targetClass.name,
      description: options.description,
      implementedInterfaceClasses,
    });
  };
}

import {
  PropertyMetadata,
  TargetClassMetadata,
} from "@src/metadata/storage/definitions/common";
import { TypeMetadata } from "@src/interfaces/metadata/common";

export default class CannotDetermineTypeError extends Error {
  constructor(
    typeKind: "input" | "output",
    {
      targetClass,
      propertyKey,
      type,
    }: TargetClassMetadata & PropertyMetadata & TypeMetadata,
  ) {
    // TODO: add support for other kind of types
    const typeName =
      type.value instanceof Function ? type.value.name : "<unknown>";
    super(
      // TODO: add message about using input type or something as a type value
      `Cannot determine GraphQL ${typeKind} type '${typeName}' ` +
        `of ${targetClass.name}#${propertyKey.toString()}!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

import {
  PropertyMetadata,
  TargetClassMetadata,
} from "@src/metadata/storage/definitions/common";

export default class SimultaneousArgsUsageError extends Error {
  constructor({
    targetClass,
    propertyKey,
  }: TargetClassMetadata & PropertyMetadata) {
    super(
      `Detected simultaneous usage of '@Args()' and '@Args("argName")' decorators ` +
        `as parameters of ${
          targetClass.name
        }#${propertyKey.toString()} method. ` +
        `You need to embed the single arg as the field of the '@InputType' class.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

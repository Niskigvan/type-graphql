import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";

export default class SimultaneousArgsUsageError extends Error {
  constructor({ target, propertyKey }: TargetMetadata & PropertyMetadata) {
    super(
      `Detected simultaneous usage of '@Args()' and '@Args("argName")' decorators ` +
        `as parameters of ${target.name}#${propertyKey.toString()} method. ` +
        `You need to embed the single arg as the field of the '@InputType' class.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

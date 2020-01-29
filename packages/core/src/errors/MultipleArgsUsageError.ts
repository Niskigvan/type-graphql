import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";

export default class MultipleArgsUsageError extends Error {
  constructor({ target, propertyKey }: TargetMetadata & PropertyMetadata) {
    super(
      `Detected multiple '@Args()' decorators as parameters ` +
        `of ${target.name}#${propertyKey.toString()} method. ` +
        `You can only use single '@Args()' parameter pointing to ` +
        `an '@InputType' class at the same time.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

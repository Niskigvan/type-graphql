import {
  PropertyMetadata,
  TargetClassMetadata,
} from "@src/metadata/storage/definitions/common";

export default class MultipleArgsUsageError extends Error {
  constructor({
    targetClass,
    propertyKey,
  }: TargetClassMetadata & PropertyMetadata) {
    super(
      `Detected multiple '@Args()' decorators as parameters ` +
        `of ${targetClass.name}#${propertyKey.toString()} method. ` +
        `You can only use single '@Args()' parameter pointing to ` +
        `an '@InputType' class at the same time.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

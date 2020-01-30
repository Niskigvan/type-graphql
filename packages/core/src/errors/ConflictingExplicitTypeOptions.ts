import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";

export default class ConflictingExplicitTypeOptions extends Error {
  constructor({
    targetClass,
    propertyKey,
  }: TargetClassMetadata & PropertyMetadata) {
    super(
      `Conflicting explicit type options for ` +
        `${targetClass.name}#${propertyKey.toString()}. ` +
        `You can provide the explicit type only as a parameter ` +
        `or as an options object property at the same time.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

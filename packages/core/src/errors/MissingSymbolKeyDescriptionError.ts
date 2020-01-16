import { TargetMetadata } from "@src/metadata/storage/definitions/common";

export default class MissingSymbolKeyDescriptionError extends Error {
  constructor({ target }: TargetMetadata) {
    super(
      "Detected symbol key without a description. " +
        `Please check the properties or methods of class '${target.name}' ` +
        "and provide a proper symbol description " +
        "or add a `schemaName` decorator option " +
        'e.g. `@Field({ schemaName: "nameOfSymbolField" })`.',
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

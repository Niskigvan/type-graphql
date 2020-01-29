import RawSpreadArgsParameterMetadata from "@src/metadata/storage/definitions/parameters/SpreadArgsParameterMetadata";

export default class WrongArgsTypeError extends Error {
  constructor({
    target,
    propertyKey,
    parameterIndex,
  }: RawSpreadArgsParameterMetadata) {
    super(
      `Detected wrong type for '@Args()' parameter ` +
        `#${parameterIndex.toFixed(0)} of ` +
        `${target.name}#${propertyKey.toString()} method. ` +
        `'@Args()' parameter has to be used with the '@InputType' class as its type.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

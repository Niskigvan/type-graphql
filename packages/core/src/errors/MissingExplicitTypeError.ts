import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import RawParameterMetadata from "@src/metadata/storage/definitions/parameters/ParameterMetadata";

export default class MissingExplicitTypeError extends Error {
  constructor(
    {
      target,
      propertyKey,
      parameterIndex,
    }: TargetMetadata & PropertyMetadata & Partial<RawParameterMetadata>,
    typeValue: Function | undefined,
  ) {
    const isParameter = parameterIndex != null;
    let errorMessage = "";
    if (typeValue) {
      errorMessage += `Cannot transform reflected type '${typeValue.name}'. `;
    }
    errorMessage += `You need to provide an explicit type for `;
    if (isParameter) {
      errorMessage += `parameter #${parameterIndex!.toFixed(0)} of `;
    }
    errorMessage += `${
      target.name
    }#${propertyKey.toString()} in decorator option, e.g. `;
    if (isParameter) {
      errorMessage += `\`@Args("myArg", { typeFn: () => [String] })\`.`;
    } else {
      errorMessage += `\`@Field(type => MyType)\`.`;
    }
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

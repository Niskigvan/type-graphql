import {
  PropertyMetadata,
  TargetMetadata,
} from "@src/metadata/storage/definitions/common";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import CannotDetermineTypeError from "@src/errors/CannotDetermineTypeError";

export default class CannotDetermineInputTypeError extends CannotDetermineTypeError {
  constructor(metadata: TargetMetadata & PropertyMetadata & TypeMetadata) {
    super("input", metadata);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

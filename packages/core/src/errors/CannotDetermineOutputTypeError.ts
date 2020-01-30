import {
  PropertyMetadata,
  TargetClassMetadata,
} from "@src/metadata/storage/definitions/common";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import CannotDetermineTypeError from "@src/errors/CannotDetermineTypeError";

export default class CannotDetermineOutputTypeError extends CannotDetermineTypeError {
  constructor(metadata: TargetClassMetadata & PropertyMetadata & TypeMetadata) {
    super("output", metadata);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

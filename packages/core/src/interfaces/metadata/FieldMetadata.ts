import RawFieldMetadata from "@src/metadata/storage/definitions/FieldMetadata";
import { TypeMetadata } from "@src/interfaces/metadata/common";

export default interface FieldMetadata extends RawFieldMetadata, TypeMetadata {}

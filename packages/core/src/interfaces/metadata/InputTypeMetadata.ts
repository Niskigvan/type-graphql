import FieldMetadata from "@src/interfaces/metadata/FieldMetadata";
import RawInputTypeMetadata from "@src/metadata/storage/definitions/InputTypeMetadata";

export default interface InputTypeMetadata extends RawInputTypeMetadata {
  fields: FieldMetadata[];
}

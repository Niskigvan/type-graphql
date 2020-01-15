import BuiltFieldMetadata from "@src/metadata/builder/definitions/FieldMetadata";
import InputTypeMetadata from "@src/metadata/storage/definitions/InputTypeMetadata";

export default interface BuiltInputTypeMetadata extends InputTypeMetadata {
  fields: BuiltFieldMetadata[];
}

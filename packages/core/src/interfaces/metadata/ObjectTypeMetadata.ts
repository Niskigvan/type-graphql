import RawObjectTypeMetadata from "@src/metadata/storage/definitions/ObjectTypeMetadata";
import FieldMetadata from "@src/interfaces/metadata/FieldMetadata";

export default interface ObjectTypeMetadata extends RawObjectTypeMetadata {
  fields: FieldMetadata[];
}

import {
  TargetClassMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawInputTypeMetadata
  extends TargetClassMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {}

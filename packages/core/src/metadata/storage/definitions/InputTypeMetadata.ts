import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawInputTypeMetadata
  extends TargetMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {}

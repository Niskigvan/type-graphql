import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface InputTypeMetadata
  extends TargetMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {}

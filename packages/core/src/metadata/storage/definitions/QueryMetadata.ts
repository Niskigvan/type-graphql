import {
  TargetMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
  PropertyMetadata,
  NullableMetadata,
  ExplicitTypeMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawQueryMetadata
  extends TargetMetadata,
    PropertyMetadata,
    SchemaNameMetadata,
    NullableMetadata,
    DescriptionMetadata,
    ExplicitTypeMetadata {}

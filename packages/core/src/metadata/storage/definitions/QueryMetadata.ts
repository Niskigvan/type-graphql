import {
  TargetClassMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
  PropertyMetadata,
  NullableMetadata,
  ExplicitTypeMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawQueryMetadata
  extends TargetClassMetadata,
    PropertyMetadata,
    SchemaNameMetadata,
    NullableMetadata,
    DescriptionMetadata,
    ExplicitTypeMetadata {}

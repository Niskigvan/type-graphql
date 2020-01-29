import ParamKind from "@src/interfaces/ParamKind";
import RawBaseParameterMetadata from "@src/metadata/storage/definitions/parameters/BaseParameterMetadata";
import {
  DescriptionMetadata,
  ExplicitTypeMetadata,
  SchemaNameMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawSingleArgParameterMetadata
  extends RawBaseParameterMetadata,
    SchemaNameMetadata,
    NullableMetadata,
    DescriptionMetadata,
    ExplicitTypeMetadata {
  kind: ParamKind.SingleArg;
}

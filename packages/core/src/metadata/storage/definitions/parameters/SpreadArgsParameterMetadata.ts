import ParamKind from "@src/interfaces/ParamKind";
import RawBaseParameterMetadata from "@src/metadata/storage/definitions/parameters/BaseParameterMetadata";
import {
  ExplicitTypeMetadata,
  NullableMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawSpreadArgsParameterMetadata
  extends RawBaseParameterMetadata,
    NullableMetadata,
    ExplicitTypeMetadata {
  kind: ParamKind.SpreadArgs;
}

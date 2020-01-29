import RawStandardParameterMetadata from "@src/metadata/storage/definitions/parameters/StandardParameterMetadata";
import RawSingleArgParameterMetadata from "@src/metadata/storage/definitions/parameters/SingleArgParamterMetadata";
import RawSpreadArgsParameterMetadata from "@src/metadata/storage/definitions/parameters/SpreadArgsParameterMetadata";

type RawParameterMetadata =
  | RawStandardParameterMetadata
  | RawSingleArgParameterMetadata
  | RawSpreadArgsParameterMetadata;

export default RawParameterMetadata;

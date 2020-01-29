import StandardParameterMetadata from "@src/interfaces/metadata/parameters/StandardParameterMetadata";
import SingleArgParameterMetadata from "@src/interfaces/metadata/parameters/SingleArgParameterMetadata";
import SpreadArgsParameterMetadata from "@src/interfaces/metadata/parameters/SpreadArgsParameterMetadata";

type ParameterMetadata =
  | StandardParameterMetadata
  | SingleArgParameterMetadata
  | SpreadArgsParameterMetadata;

export default ParameterMetadata;

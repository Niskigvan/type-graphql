import RawQueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";

export default interface QueryMetadata extends RawQueryMetadata, TypeMetadata {
  parameters: ParameterMetadata[];
}

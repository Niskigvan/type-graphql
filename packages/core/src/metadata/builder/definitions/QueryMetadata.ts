import QueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import { BuiltTypeMetadata } from "@src/metadata/builder/definitions/common";
import ParameterMetadata from "@src/metadata/storage/definitions/ParameterMetadata";

export default interface BuiltQueryMetadata
  extends QueryMetadata,
    BuiltTypeMetadata {
  parameters: ParameterMetadata[] | undefined;
}

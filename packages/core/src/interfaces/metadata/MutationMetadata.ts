import RawMutationMetadata from "@src/metadata/storage/definitions/MutationMetadata";
import { TypeMetadata } from "@src/interfaces/metadata/common";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";

export default interface MutationMetadata
  extends RawMutationMetadata,
    TypeMetadata {
  parameters: ParameterMetadata[];
}

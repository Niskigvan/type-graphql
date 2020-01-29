import { TypeMetadata } from "@src/interfaces/metadata/common";
import RawSingleArgParameterMetadata from "@src/metadata/storage/definitions/parameters/SingleArgParamterMetadata";

export default interface SingleArgParamterMetadata
  extends RawSingleArgParameterMetadata,
    TypeMetadata {}

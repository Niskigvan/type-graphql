import {
  TargetMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ClassType from "@src/interfaces/ClassType";

export default interface ParameterMetadata
  extends TargetMetadata,
    PropertyMetadata {
  parameterIndex: number;
  parameterResolverClass: ClassType<ParameterResolver>;
}

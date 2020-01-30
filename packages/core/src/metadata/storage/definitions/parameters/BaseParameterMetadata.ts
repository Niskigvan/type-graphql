import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ClassType from "@src/interfaces/ClassType";
import ParamKind from "@src/interfaces/ParamKind";

export default interface RawBaseParameterMetadata
  extends TargetClassMetadata,
    PropertyMetadata {
  kind: ParamKind;
  parameterIndex: number;
  parameterResolverClass: ClassType<ParameterResolver>;
}

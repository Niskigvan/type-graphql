import ClassType from "@src/interfaces/ClassType";
import {
  TargetClassMetadata,
  SchemaNameMetadata,
  DescriptionMetadata,
} from "@src/metadata/storage/definitions/common";

export default interface RawObjectTypeMetadata
  extends TargetClassMetadata,
    SchemaNameMetadata,
    DescriptionMetadata {
  implementedInterfaceClasses: ClassType[];
}

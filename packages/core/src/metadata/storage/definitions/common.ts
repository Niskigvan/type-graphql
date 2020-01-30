import ClassType from "@src/interfaces/ClassType";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";

export interface TargetClassMetadata {
  targetClass: ClassType;
}

export interface PropertyMetadata {
  propertyKey: string | symbol;
}

export interface SchemaNameMetadata {
  schemaName: string;
}

export interface DescriptionMetadata {
  description: string | undefined;
}

export interface NullableMetadata {
  nullable: boolean | undefined;
}

export interface ExplicitTypeMetadata {
  explicitTypeFn: ExplicitTypeFn | undefined;
}

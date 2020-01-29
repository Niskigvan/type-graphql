import TypeValue from "@src/interfaces/TypeValue";

export interface TypeModifiers {
  nullable: boolean;
  /** Value 0 means no list */
  listDepth: number;
}

export interface TypeInfo {
  value: TypeValue;
  modifiers: TypeModifiers;
}

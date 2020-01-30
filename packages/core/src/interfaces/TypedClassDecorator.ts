import ClassType from "@src/interfaces/ClassType";

type TypedClassDecorator = <TTargetClass extends ClassType>(
  targetClass: TTargetClass,
) => TTargetClass | void;

export default TypedClassDecorator;

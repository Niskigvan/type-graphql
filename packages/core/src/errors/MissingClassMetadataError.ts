import ClassType from "@src/interfaces/ClassType";

export type MissingMetadataType = "ObjectType" | "InputType" | "Resolver";

export default class MissingClassMetadataError extends Error {
  constructor(typeClass: ClassType, type?: MissingMetadataType) {
    super(
      `Cannot find metadata for class '${typeClass.name}' in storage. ` +
        `Is it annotated with ` +
        (type ? `the '@${type}'` : `a TypeGraphQL`) +
        ` decorator?`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

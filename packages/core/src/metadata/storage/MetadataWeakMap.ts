import { TargetMetadata } from "@src/metadata/storage/definitions/common";
import ClassType from "@src/interfaces/ClassType";

export default class MetadataWeakMap<TMetadata extends TargetMetadata> {
  private readonly metadataMap = new WeakMap<ClassType, TMetadata>();

  collect(metadata: TMetadata): void {
    // TODO: maybe check with `.has` to prevent duplicates?
    this.metadataMap.set(metadata.target, metadata);
  }

  find(typeClass: ClassType): TMetadata | undefined {
    return this.metadataMap.get(typeClass);
  }
}

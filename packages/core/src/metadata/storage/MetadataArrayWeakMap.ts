import { TargetMetadata } from "@src/metadata/storage/definitions/common";
import ClassType from "@src/interfaces/ClassType";

export default class MetadataArrayWeakMap<TMetadata extends TargetMetadata> {
  private readonly metadataMap = new WeakMap<ClassType, TMetadata[]>();

  collect(metadata: TMetadata): void {
    // TODO: how to prevent duplicates?
    this.metadataMap.set(metadata.target, [
      ...(this.find(metadata.target) ?? []),
      metadata,
    ]);
  }

  find(typeClass: ClassType): TMetadata[] | undefined {
    return this.metadataMap.get(typeClass);
  }
}

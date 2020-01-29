import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";

/**
 * Decorator used to register the class as resolver class
 * which is grouping queries, mutation and subscription handlers
 */
export default function Resolver(): TypedClassDecorator {
  return target => {
    RawMetadataStorage.get().collectResolverMetadata({
      target,
    });
  };
}

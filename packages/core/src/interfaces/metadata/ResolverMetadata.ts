import RawResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import QueryMetadata from "@src/interfaces/metadata/QueryMetadata";

export default interface ResolverMetadata extends RawResolverMetadata {
  queries: QueryMetadata[];
}

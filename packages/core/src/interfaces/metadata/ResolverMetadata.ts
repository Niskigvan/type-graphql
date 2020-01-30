import RawResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import QueryMetadata from "@src/interfaces/metadata/QueryMetadata";
import MutationMetadata from "@src/interfaces/metadata/MutationMetadata";

export default interface ResolverMetadata extends RawResolverMetadata {
  queries: QueryMetadata[];
  mutations: MutationMetadata[];
}

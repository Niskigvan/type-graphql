import ResolverData from "@src/interfaces/ResolverData";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";

export default interface ParameterResolver<
  TContext extends object = {},
  TArgs extends object = {},
  TSource = unknown
> {
  resolve(
    data: ResolverData<TContext, TArgs, TSource>,
    metadata: ParameterMetadata,
  ): Promise<unknown> | unknown;
}

import ResolverData from "@src/interfaces/ResolverData";

export default interface ParameterResolver<TContext extends object = {}> {
  resolve(data: ResolverData<TContext>): Promise<unknown> | unknown;
}

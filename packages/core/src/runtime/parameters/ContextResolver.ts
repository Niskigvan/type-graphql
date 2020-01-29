import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

export default class ContextParameterResolver implements ParameterResolver {
  resolve({ context }: ResolverData): unknown {
    return context;
  }
}

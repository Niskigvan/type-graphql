import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

export default class SourceParameterResolver implements ParameterResolver {
  resolve({ source }: ResolverData): unknown {
    return source;
  }
}

import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

export default class InfoParameterResolver implements ParameterResolver {
  resolve({ info }: ResolverData): unknown {
    return info;
  }
}

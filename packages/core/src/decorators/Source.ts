import createParameterDecorator from "@src/decorators/createParamDecorator";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

class SourceParameterResolver implements ParameterResolver {
  resolve({ source }: ResolverData): unknown {
    return source;
  }
}

export default function Source(): ParameterDecorator {
  return createParameterDecorator(SourceParameterResolver);
}

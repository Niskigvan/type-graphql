import createParameterDecorator from "@src/decorators/createParamDecorator";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

class ContextParameterResolver implements ParameterResolver {
  resolve({ context }: ResolverData): unknown {
    return context;
  }
}

export default function Context(): ParameterDecorator {
  return createParameterDecorator(ContextParameterResolver);
}

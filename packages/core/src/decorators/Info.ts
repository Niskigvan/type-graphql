import createParameterDecorator from "@src/decorators/createParamDecorator";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";

class InfoParameterResolver implements ParameterResolver {
  resolve({ info }: ResolverData): unknown {
    return info;
  }
}

export default function Info(): ParameterDecorator {
  return createParameterDecorator(InfoParameterResolver);
}

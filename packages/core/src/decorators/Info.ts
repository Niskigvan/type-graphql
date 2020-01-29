import createParameterDecorator from "@src/decorators/createParamDecorator";
import InfoParameterResolver from "@src/runtime/parameters/InfoResolver";

/**
 * Parameter decorator that can be used
 * to inject `info` property of resolver data
 * into the resolver handler
 *
 * @example
 * `sampleQuery(@Info() info: GraphQLResolveInfo): unknown {}`
 */
export default function Info(): ParameterDecorator {
  return createParameterDecorator(InfoParameterResolver);
}

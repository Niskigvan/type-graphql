import createParameterDecorator from "@src/decorators/createParamDecorator";
import ContextParameterResolver from "@src/runtime/parameters/ContextResolver";

/**
 * Parameter decorator that can be used
 * to inject `context` property of resolver data
 * into the resolver handler
 *
 * @example
 * `sampleQuery(@Context() context: ContextType): unknown {}`
 */
export default function Context(): ParameterDecorator {
  return createParameterDecorator(ContextParameterResolver);
}

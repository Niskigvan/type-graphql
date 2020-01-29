import createParameterDecorator from "@src/decorators/createParamDecorator";
import SourceParameterResolver from "@src/runtime/parameters/SourceResolver";

/**
 * Parameter decorator that can be used
 * to inject `source` property of resolver data
 * into the resolver handler
 *
 * @example
 * `sampleQuery(@Source() source: unknown): unknown {}`
 */
export default function Source(): ParameterDecorator {
  return createParameterDecorator(SourceParameterResolver);
}

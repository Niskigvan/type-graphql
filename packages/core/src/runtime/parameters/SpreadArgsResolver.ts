import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";
import SpreadArgsParameterMetadata from "@src/interfaces/metadata/parameters/SpreadArgsParameterMetadata";
import ClassType from "@src/interfaces/ClassType";

export default class SpreadArgsParameterResolver implements ParameterResolver {
  resolve(
    { args }: ResolverData,
    metadata: SpreadArgsParameterMetadata,
  ): unknown {
    // TODO: create instance of the args class?
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const InputTypeClass = metadata.type.value as ClassType;
    return args;
  }
}

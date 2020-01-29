import ParameterResolver from "@src/interfaces/ParameterResolver";
import ResolverData from "@src/interfaces/ResolverData";
import SingleArgParamterMetadata from "@src/interfaces/metadata/parameters/SingleArgParameterMetadata";

export default class SingleArgParameterResolver implements ParameterResolver {
  resolve(
    { args }: ResolverData<object, Record<string, unknown>>,
    { schemaName }: SingleArgParamterMetadata,
  ): unknown {
    return args[schemaName];
  }
}

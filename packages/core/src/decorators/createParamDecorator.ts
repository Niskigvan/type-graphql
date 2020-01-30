import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ClassType from "@src/interfaces/ClassType";
import ParameterResolver from "@src/interfaces/ParameterResolver";
import ParamKind from "@src/interfaces/ParamKind";

export default function createParameterDecorator<TContext extends object = {}>(
  parameterResolver: ClassType<ParameterResolver<TContext>>,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const targetClass = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    RawMetadataStorage.get().collectParameterMetadata({
      kind: ParamKind.Standard,
      targetClass,
      propertyKey,
      parameterIndex,
      parameterResolverClass: parameterResolver,
    });
  };
}

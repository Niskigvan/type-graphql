import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import ClassType from "@src/interfaces/ClassType";
import ParameterResolver from "@src/interfaces/ParameterResolver";

export default function createParameterDecorator<TContext extends object = {}>(
  parameterResolver: ClassType<ParameterResolver<TContext>>,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const target = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    MetadataStorage.get().collectParameterMetadata({
      target,
      propertyKey,
      parameterIndex,
      parameterResolverClass: parameterResolver,
    });
  };
}

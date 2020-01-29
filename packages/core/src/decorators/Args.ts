import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ClassType from "@src/interfaces/ClassType";
import ParamKind from "@src/interfaces/ParamKind";
import {
  ExplicitTypeable,
  Nullable,
  Descriptionable,
} from "@src/decorators/types";
import SingleArgParameterResolver from "@src/runtime/parameters/SingleArgResolver";
import SpreadArgsParameterResolver from "@src/runtime/parameters/SpreadArgsResolver";

export interface SpreadArgsOptions extends ExplicitTypeable {}
export interface SingleArgOptions
  extends Descriptionable,
    ExplicitTypeable,
    Nullable {}

/**
 * Parameter decorator that can be used
 * to declare the arguments based on `@InputType` class
 * and to inject whole `args` object of resolver data
 * into the resolver handler
 *
 * @example
 * `sampleQuery(@Args() myArgs: SampleArgs): unknown {}`
 */
export default function Args(options?: SpreadArgsOptions): ParameterDecorator;
/**
 * Parameter decorator that can be used
 * to declare inline a single argument
 * and to inject that single `args` property of resolver data
 * into the resolver handler
 *
 * @example
 * `sampleQuery(@Args('myArgument') myArgument: string): unknown {}`
 */
export default function Args(
  argumentName: string,
  options?: SingleArgOptions,
): ParameterDecorator;
export default function Args(
  argumentNameOrSpreadOptions?: string | SpreadArgsOptions,
  maybeSingleArgOptions?: SingleArgOptions,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const target = prototype.constructor as ClassType;
    if (typeof argumentNameOrSpreadOptions === "string") {
      const schemaName = argumentNameOrSpreadOptions;
      const options = maybeSingleArgOptions ?? {};
      RawMetadataStorage.get().collectParameterMetadata({
        kind: ParamKind.SingleArg,
        target,
        propertyKey,
        parameterIndex,
        parameterResolverClass: SingleArgParameterResolver,
        nullable: options.nullable,
        explicitTypeFn: options.typeFn,
        schemaName,
        description: options.description,
      });
    } else {
      const options = argumentNameOrSpreadOptions ?? {};
      RawMetadataStorage.get().collectParameterMetadata({
        kind: ParamKind.SpreadArgs,
        target,
        propertyKey,
        parameterIndex,
        parameterResolverClass: SpreadArgsParameterResolver,
        nullable: false,
        explicitTypeFn: options.typeFn,
      });
    }
  };
}

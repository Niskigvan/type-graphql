import createDebug from "debug";
import { GraphQLFieldResolver } from "graphql";

import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";
import { BuildSchemaConfig } from "@src/schema/schema-config";
import ResolverData from "@src/interfaces/ResolverData";
import { DynamicResolverInstance } from "@src/runtime/types";
import completeValue from "@src/helpers/completeValue";
import ParameterMetadata from "@src/metadata/storage/definitions/ParameterMetadata";
import completeValues from "@src/helpers/completeValues";

const debug = createDebug("@typegraphql/core:RuntimeGenerator");

export default class RuntimeGenerator<TContext extends object = {}> {
  constructor(private readonly config: BuildSchemaConfig<TContext>) {
    debug("created RuntimeGenerator instance", config);
  }

  generateQueryResolveHandler({
    target,
    propertyKey,
    parameters,
  }: BuiltQueryMetadata): GraphQLFieldResolver<unknown, TContext, object> {
    const { container } = this.config;
    return (source, args, context, info) => {
      const resolverData: ResolverData<TContext> = {
        source,
        args,
        context,
        info,
      };
      return completeValues(
        this.getResolvedParameters(parameters, resolverData),
        resolvedParameters =>
          completeValue(
            container.getInstance(target, resolverData),
            (resolverInstance: DynamicResolverInstance) => {
              // workaround until TS support indexing by symbol
              // https://github.com/microsoft/TypeScript/issues/1863
              const methodName = propertyKey as string;
              // TODO: maybe replace with `.apply()` for perf reasons?
              return resolverInstance[methodName](...resolvedParameters);
            },
          ),
      );
    };
  }

  private getResolvedParameters(
    parameters: ParameterMetadata[] | undefined,
    resolverData: ResolverData<TContext>,
  ): Array<PromiseLike<unknown> | unknown> {
    if (!parameters) {
      return [];
    }

    const { container } = this.config;
    return parameters
      .slice()
      .sort((a, b) => a.parameterIndex - b.parameterIndex)
      .map(parameterMetadata =>
        completeValue(
          container.getInstance(
            parameterMetadata.parameterResolverClass,
            resolverData,
          ),
          parameterResolver => parameterResolver.resolve(resolverData),
        ),
      );
  }
}

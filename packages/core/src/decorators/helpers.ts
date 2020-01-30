import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  MissingSymbolKeyDescriptionError,
  ConflictingExplicitTypeOptions,
} from "@src/errors";
import { ExplicitTypeable, Nameable } from "@src/decorators/types";
import {
  TargetClassMetadata,
  PropertyMetadata,
} from "@src/metadata/storage/definitions/common";
import parseStringOrSymbol from "@src/helpers/parseStringOrSymbol";

export interface TypeDecoratorParams<TOptions extends ExplicitTypeable> {
  options?: Omit<TOptions, keyof ExplicitTypeable>;
  explicitTypeFn?: ExplicitTypeFn;
}

export function parseDecoratorParameters<TOptions extends ExplicitTypeable>(
  maybeExplicitTypeFnOrOptions: ExplicitTypeFn | TOptions | undefined,
  maybeOptions: TOptions | undefined,
  metadata: TargetClassMetadata & PropertyMetadata,
): TypeDecoratorParams<TOptions> {
  if (!maybeExplicitTypeFnOrOptions) {
    return {};
  }
  if (typeof maybeExplicitTypeFnOrOptions === "object") {
    const { typeFn: explicitTypeFn, ...options } = maybeExplicitTypeFnOrOptions;
    return { explicitTypeFn, options };
  }
  if (maybeOptions?.typeFn) {
    throw new ConflictingExplicitTypeOptions(metadata);
  }
  return {
    explicitTypeFn: maybeExplicitTypeFnOrOptions,
    options: maybeOptions,
  };
}

export function getSchemaName(
  options: Nameable,
  propertyKey: string | symbol,
  metadata: TargetClassMetadata,
): string {
  const schemaName = options.schemaName ?? parseStringOrSymbol(propertyKey);
  if (!schemaName) {
    throw new MissingSymbolKeyDescriptionError(metadata);
  }
  return schemaName;
}

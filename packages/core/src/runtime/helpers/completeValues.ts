import isPromiseLike from "@src/runtime/helpers/isPromiseLike";

// TODO: use tuple trick from `Promise.all` for proper typings of `completeValues`
type UnpackedPromises<TArray extends unknown[]> = TArray extends Array<
  infer TItem
>
  ? Array<UnpackPromise<TItem>>
  : never;
type UnpackPromise<
  TValue extends PromiseLike<unknown> | unknown
> = TValue extends PromiseLike<infer TInside> ? TInside : TValue;

/**
 * Helper for allowing using async execution path
 * without paying the cost of the Promises if not required
 */
export default function completeValues<
  TValues extends Array<Promise<unknown> | unknown>,
  TReturn
>(
  promisesOrValues: TValues,
  onSuccess: (values: UnpackedPromises<TValues>) => TReturn,
  onError?: (error: unknown) => TReturn,
): PromiseLike<TReturn> | TReturn {
  if (promisesOrValues.some(isPromiseLike)) {
    return Promise.all(promisesOrValues).then(
      resolvedValues => onSuccess(resolvedValues as UnpackedPromises<TValues>),
      onError,
    );
  } else {
    // no onError as handled by try-catch outside
    return onSuccess(
      (promisesOrValues as unknown[]) as UnpackedPromises<TValues>,
    );
  }
}

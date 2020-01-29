import isPromiseLike from "@src/runtime/helpers/isPromiseLike";

/**
 * Helper for allowing using async execution path
 * without paying the cost of the Promise if not required
 */
export default function completeValue<TValue, TReturn>(
  promiseOrValue: PromiseLike<TValue> | TValue,
  onSuccess: (value: TValue) => TReturn,
  onError?: (error: unknown) => TReturn,
): PromiseLike<TReturn> | TReturn {
  if (isPromiseLike(promiseOrValue)) {
    return promiseOrValue.then(onSuccess, onError);
  } else {
    // no onError as handled by try-catch outside
    return onSuccess(promiseOrValue);
  }
}

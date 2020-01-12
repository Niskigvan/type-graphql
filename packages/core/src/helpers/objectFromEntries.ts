// TODO: replace with `Object.fromEntries` when `target` or `lib` in tsconfig allows that
export default function objectFromEntries<TPropertyValue>(
  iterable: Iterable<[string, TPropertyValue]>,
): Record<string, TPropertyValue> {
  const object: Record<string, TPropertyValue> = {};
  for (const [propertyKey, propertyValue] of iterable) {
    object[propertyKey] = propertyValue;
  }
  return object;
}

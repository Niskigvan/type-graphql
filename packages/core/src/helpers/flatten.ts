export default function flatten<TItem>(nestedArray: TItem[][]): TItem[] {
  return nestedArray.reduce(
    (flattenedArray, array) => flattenedArray.concat(...array),
    [],
  );
}

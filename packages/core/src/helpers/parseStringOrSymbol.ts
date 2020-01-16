const SYMBOL_DESCRIPTION_START_INDEX = 7;

export default function parseStringOrSymbol(
  stringOrSymbol: string | symbol,
): string | undefined {
  if (typeof stringOrSymbol === "string") {
    return stringOrSymbol;
  }

  // TODO: use `Symbol.prototype.description`
  const symbolDescription = stringOrSymbol
    .toString()
    .slice(SYMBOL_DESCRIPTION_START_INDEX, -1);
  return symbolDescription;
}

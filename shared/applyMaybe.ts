// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function applyMaybe<Type = any, Return = any>(
  fn: (i: Type) => Return,
  input: Type | undefined
): Return | undefined {
  if (input === undefined) {
    return undefined;
  }

  return fn(input);
}

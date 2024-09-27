export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function groupBy<T, K>(
  array: T[],
  keySelector: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (const item of array) {
    const key = keySelector(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(item);
  }

  return map;
}

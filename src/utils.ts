export function parseNullableString(str: string): string | null {
  return str.toUpperCase() === 'NULL' ? null : str;
}

export function groupBy<T>(arr: T[], key: string): { [key: string]: T[] } {
  return arr.reduce((acc, elem) => {
    (acc[elem[key]] = acc[elem[key]] || []).push(elem);
    return acc;
  }, {});
}

export function byId<T>(
  arr: T[],
  getId: (gare: T) => number,
): { [key: number]: T } {
  return arr.reduce((acc, item) => {
    acc[getId(item)] = item;
    return acc;
  }, {});
}

export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

export function parseNullableString(str: string): string | null {
  return str.toUpperCase() === 'NULL' ? null : str;
}

export function groupBy<T>(
  arr: T[],
  key: string,
  getElem: (T) => any = null,
): { [key: string]: T[] } {
  return arr.reduce((acc, elem) => {
    const finalElem = getElem ? getElem(elem) : elem;
    (acc[elem[key]] = acc[elem[key]] || []).push(finalElem);

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

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import { IPrix, IRawPrix } from '../interfaces/IPrix.js';

export function priceMapper(obj: IRawPrix): IPrix {
  const distances = Array<number>();

  // eslint-disable-next-line no-constant-condition
  for (let i = 1; true; i++) {
    const fr: string = obj[`distance${i}`];

    if (fr === undefined) break;

    const parsedFr = parseFloat(fr);

    if (!Number.isNaN(parsedFr) && parsedFr !== null) distances.push(parsedFr);
  }

  const reductions = Object.entries(obj)
    .filter(_ => _[0].startsWith('reduction_'))
    .map(_ => Number.parseFloat(_[1]))
    .filter(_ => !Number.isNaN(_));

  return {
    id: +obj.id,
    bareme_id: +obj.bareme_id,
    classe: +obj.classe,
    distances,
    reductions,
  };
}

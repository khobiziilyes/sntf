import { IGare, IRawGare } from '../interfaces/IGare.js';

function parseInt(str: string): number | null {
  const parsed = Number.parseInt(str);
  if (Number.isNaN(parsed)) return null;

  return parsed;
}

export function gareMapper(obj: IRawGare): IGare {
  const next = Array<number>();

  // eslint-disable-next-line no-constant-condition
  for (let i = 1; true; i++) {
    const fr: string = obj[`suivant${i}`];
    const ar: string = obj[`suivant${i}_ar`];

    if (fr === undefined && ar === undefined) break;

    const parsedFr = parseInt(fr);
    const parsedAr = parseInt(ar);

    if (parsedFr) next.push(parsedFr);
    if (parsedAr) next.push(parsedAr);
  }

  return {
    id: +obj.id,
    region_code: +obj.region_code,
    names: {
      ar: obj.nom_ar,
      fr: obj.nom_fr,
    },
    location: {
      lat: +obj.lat,
      log: +obj.log,
    },
    next,
  };
}

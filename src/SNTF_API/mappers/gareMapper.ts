import { IGare, IRawGare } from '../interfaces/IGare.js';

export function gareMapper(obj: IRawGare): IGare {
  const next = Array<number>();

  // eslint-disable-next-line no-constant-condition
  for (let i = 1; true; i++) {
    const fr: string = obj[`suivant${i}`];
    if (fr === null || fr === undefined) break;

    next.push(+fr);
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

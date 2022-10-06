import { IGare, IRawGare } from '../interfaces/IGare.js';

function parseInt(str: string): number | null {
  const parsed = Number.parseInt(str);
  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function fixName(str: string): string {
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map(_ =>
      (_ && _.length && _[0].toUpperCase() + _.slice(1).toLowerCase()).trim(),
    )
    .join(' ');
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

  const frName = fixName(obj.nom_fr);
  const arName = fixName(obj.nom_ar);

  return {
    id: +obj.id,
    region_code: +obj.region_code,
    frName,
    arName,
    location: {
      lat: +obj.lat,
      log: +obj.log,
    },
    next,
  };
}

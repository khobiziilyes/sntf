import { booleanString } from '../../utils.js';
import { IBareme, IRawBareme } from '../interfaces/IBareme.js';

export function baremeMapper(obj: IRawBareme): IBareme {
  const taxes = Array<number>();

  // eslint-disable-next-line no-constant-condition
  for (let i = 1; true; i++) {
    const fr: string = obj[`taxe_fixe${i}`];
    const ar: string = obj[`taxe_fixe${i}_ar`];

    if (fr === undefined && ar === undefined) break;

    const parsedFr = parseFloat(fr);
    const parsedAr = parseFloat(ar);

    if (parsedFr) taxes.push(parsedFr);
    if (parsedAr) taxes.push(parsedAr);
  }

  return {
    id: +obj.id,
    name: obj.nom,
    published: booleanString(obj.published),
    taxes,
    comments: {
      ar: obj.commentaire_ar,
      en: obj.commentaire_en,
      fr: obj.commentaire_fr,
    },
  };
}

import { IBareme, IRawBareme } from '../interfaces/IBareme.js';

function booleanString(str: string): boolean {
  return str === '1';
}

export function baremeMapper(obj: IRawBareme): IBareme {
  return {
    id: +obj.id,
    name: obj.nom,
    published: booleanString(obj.published),
    taxes: [],
    comments: {
      ar: obj.commentaire_ar,
      en: obj.commentaire_en,
      fr: obj.commentaire_fr,
    },
  };
}

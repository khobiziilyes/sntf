import { IRawTrain, ITrain } from '../interfaces/ITrain.js';

function booleanString(str: string): boolean {
  return str === '1';
}

export function trainMapper(obj: IRawTrain): ITrain {
  const available_days = {
    Sun: booleanString(obj.dim),
    Mon: booleanString(obj.lun),
    Tue: booleanString(obj.mar),
    Wed: booleanString(obj.mer),
    Thu: booleanString(obj.jeu),
    Fri: booleanString(obj.ven),
    Sat: booleanString(obj.sam),
  };

  const mode_circulation = (() => {
    const original_mode = +obj.mode_circulation;

    if (original_mode === 1) return 'EXCEPT_FRIDAY_AND_HOLIDAYS';
    if (original_mode === 2) return 'ONLY_FRIDAY_AND_HOLIDAYS';
    if (original_mode === 3) return 'WEEKDAYS';

    return 'ALWAYS';
  })();

  return {
    id: +obj.id,
    number: obj.numero,
    published: booleanString(obj.published),
    available: Object.values(available_days).includes(true),

    distinations: obj.distination.split('-'),
    relations: obj.relation.split('-'),

    region_id: +obj.region_id,
    bareme_id: +obj.bareme_id,
    line_id: +obj.line,

    start_date: new Date(), // TODO:
    end_date: new Date(), // TODO:

    line_type: obj.type_ligne,
    train_type: 'Coradia', // TODO: obj.type_train

    mode_circulation,
    restauration: !obj.restauration,

    available_days,

    classes: {
      first: {
        exists: booleanString(obj.premiere_classe),
        seats: booleanString(obj.assise_premiere_classe),
        couchette: booleanString(obj.couchette_premiere_classe),
      },
      second: {
        exists: true,
        seats: booleanString(obj.assise_deuxieme_classe),
        couchette: booleanString(obj.couchette_deuxieme_classe),
      },
    },

    comments: {
      ar: obj.commentaire_ar,
      en: obj.commentaire_en,
      fr: obj.commentaire_fr,
    },
  };
}

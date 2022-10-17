import {
  DaysAvailabilityObj,
  IRawTrain,
  ITrain,
} from '../interfaces/ITrain.js';

function booleanString(str: string): boolean {
  return str === '1';
}

export function trainMapper(obj: IRawTrain): ITrain {
  const mode_circulation = (() => {
    const original_mode = +obj.mode_circulation;

    if (original_mode === 1) return 'EXCEPT_FRIDAY_AND_HOLIDAYS';
    if (original_mode === 2) return 'ONLY_FRIDAY_AND_HOLIDAYS';
    if (original_mode === 3) return 'WEEKDAYS';

    return 'ALWAYS';
  })();

  // To quickly build the object.
  // Format: [dayName, nomDuJour, isAWeekDay]
  const available_days = (
    [
      ['Sun', 'dim', true],
      ['Mon', 'lun', true],
      ['Tue', 'mar', true],
      ['Wed', 'mer', true],
      ['Thu', 'jeu', true],
      ['Fri', 'ven', false],
      ['Sat', 'sam', false],
    ] as [string, string, boolean][]
  ).reduce((acc, elem) => {
    acc[elem[0]] =
      mode_circulation === 'ALWAYS' ||
      (mode_circulation === 'WEEKDAYS' && elem[2]) ||
      (mode_circulation === 'ONLY_FRIDAY_AND_HOLIDAYS' && elem[0] === 'Fri') ||
      (mode_circulation === 'EXCEPT_FRIDAY_AND_HOLIDAYS' &&
        elem[0] !== 'Fri') ||
      booleanString(obj[elem[1]]);

    return acc;
  }, {} as DaysAvailabilityObj);

  const line_type = (() => {
    const original_type = +obj.type_ligne;

    if (original_type === 1) return 'Banlieue';
    if (original_type === 2) return 'Regionale';

    return 'Grande';
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

    line_type,
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

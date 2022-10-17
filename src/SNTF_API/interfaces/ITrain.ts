export interface DaysAvailabilityObj {
  Sun: boolean;
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
}
interface seatsClass {
  exists: boolean;
  seats: boolean;
  couchette: boolean;
}
export interface ITrain {
  id: number;
  number: string;
  published: boolean;
  available: boolean;

  distinations: string[];
  relations: string[];

  region_id: number;
  bareme_id: number;
  line_id: number;

  start_date: Date;
  end_date: Date;

  line_type: 'Banlieue' | 'Regionale' | 'Grande';

  train_type: 'DSL' | 'Coradia' | 'Coradia DSL';

  mode_circulation:
    | 'ALWAYS'
    | 'EXCEPT_FRIDAY_AND_HOLIDAYS'
    | 'ONLY_FRIDAY_AND_HOLIDAYS'
    | 'WEEKDAYS';

  restauration: boolean;

  classes: {
    first: seatsClass;
    second: seatsClass;
  };

  available_days: DaysAvailabilityObj;

  comments: { [lang: string]: string };
}

export interface IRawTrain {
  id: string;
  numero: string;

  date_debut: string;
  date_fin: string;

  type_ligne: string;
  type_train: string;

  mode_circulation: string;
  restauration: string;
  premiere_classe: string;
  published: string;
  couchette: string;
  bareme_id: string;

  commentaire_fr: string;
  commentaire_ar: string;
  commentaire_en: string;

  region_id: string;

  assise_premiere_classe: string;
  assise_deuxieme_classe: string;
  couchette_premiere_classe: string;
  couchette_deuxieme_classe: string;

  line: string;

  sam: string;
  dim: string;
  lun: string;
  mar: string;
  mer: string;
  jeu: string;
  ven: string;

  distination: string;
  relation: string;

  field31: '';
  field32: '';
}

export interface ITrain {
  id: number;
  numero: string;

  date_debut: string; // TODO:
  date_fin: '00/00/00'; // TODO:

  type_ligne: number;
  type_train: number;

  mode_circulation: boolean;
  restauration: boolean;
  premiere_classe: boolean;
  published: boolean;
  couchette: boolean;
  bareme_id: number;

  commentaire_fr: string;
  commentaire_ar: string;
  commentaire_en: string;

  region_id: number;

  assise_premiere_classe: boolean;
  assise_deuxieme_classe: boolean;
  couchette_premiere_classe: boolean;
  couchette_deuxieme_classe: boolean;

  line: number;

  sam: boolean;
  dim: boolean;
  lun: boolean;
  mar: boolean;
  mer: boolean;
  jeu: boolean;
  ven: boolean;

  distination: string;
  relation: string;

  field31: '';
  field32: '';
}

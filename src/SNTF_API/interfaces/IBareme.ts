export interface IBareme {
  id: number;
  name: string;
  published: boolean;

  taxes: { [lang: string]: number }[];

  comments: { [lang: string]: string };
}
export interface IRawBareme {
  id: string;
  nom: string;
  published: string;

  taxe_fixe1: string;
  taxe_fixe2: string;

  taxe_fixe1_ar: string;
  taxe_fixe2_ar: string;

  commentaire_fr: string;
  commentaire_ar: string;
  commentaire_en: string;

  field11: '';
}

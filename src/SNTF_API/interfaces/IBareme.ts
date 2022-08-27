export interface IBareme {
  id: number;
  nom: string;
  published: boolean;

  taxe_fixe1: number;
  taxe_fixe2: number;

  taxe_fixe1_ar: number;
  taxe_fixe2_ar: number;

  commentaire_fr: string;
  commentaire_ar: string;
  commentaire_en: string;

  field11: '';
}

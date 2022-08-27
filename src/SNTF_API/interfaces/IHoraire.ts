type heure = string;

export interface IHoraire {
  id: number;

  train_id: number;
  gare_id: number;

  heure: heure;

  jour_suivant: boolean;
  distance: number;

  field7: '';
  field8: '';
}

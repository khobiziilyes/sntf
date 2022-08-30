export interface IHoraire {
  id: number;

  train_id: number;
  gare_id: number;

  time: Date;

  available_tomorrow: boolean;
  distance: number;

  time_str: string;
  timestamp: number;
}

export interface IRawHoraire {
  id: string;

  train_id: string;
  gare_id: string;

  heure: string;

  jour_suivant: string;
  distance: string;

  field7: '';
  field8: '';
}

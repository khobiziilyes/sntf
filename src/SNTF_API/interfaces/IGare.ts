type Nnumber = number | null;

export interface IGare {
  id: number;
  region_code: number;
  frName: string;
  arName: string;
  location: {
    lat: number;
    log: number;
  };
  next: number[];
}
export interface IRawGare {
  id: number;

  nom_fr: string;
  nom_ar: string;

  region_code: number;

  lat: number;
  log: number;

  suivant1: Nnumber;
  suivant1_ar: Nnumber;

  suivant2: Nnumber;
  suivant2_ar: Nnumber;

  suivant3: Nnumber;
  suivant3_ar: Nnumber;

  field13: '';
  field14: '';
}

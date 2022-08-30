export interface IPrix {
  id: number;
  bareme_id: number;
  classe_id: number;

  distances: number[];
  reductions: number[];
}
export interface IRawPrix {
  id: string;
  bareme_id: string;
  classe: string;

  distance1: string;
  distance2: string;

  reduction_0: string;
  reduction_50: string;

  field8: '';
  field9: '';
}

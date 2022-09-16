import { IHoraire } from './interfaces/IHoraire.js';

export function getPathDistances(path: IHoraire[]): number[] {
  const relativeDistances = path.map(_ => _.distance);

  return relativeDistances
    .slice(1)
    .sort((a, b) => a - b)
    .map((_, i) => _ - relativeDistances[i]);
}

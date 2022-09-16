import { IHoraire } from './interfaces/IHoraire.js';
import { ITrain } from './interfaces/ITrain.js';

function sortHoraires(arr: IHoraire[][]): IHoraire[][] {
  return arr.sort((a, b) => a[0].timestamp - b[0].timestamp);
}

export function getStationsPaths(
  horaires: IHoraire[],
  trainsById: { [train_id: number]: ITrain },
  startStationId: number,
  endStationId: number,
): IHoraire[][] {
  // Horaires of trains that will go out from startStation to ANYWHERE
  // Map each horaire to their proper train, with filtering only published ones.
  const availableTrains: ITrain[] = horaires
    .filter(_ => _.gare_id === startStationId)
    .map(_ => trainsById[_.train_id])
    .filter(_ => _);

  const pathsByTrain: IHoraire[][] = [];

  for (const train of availableTrains) {
    const trainPath: IHoraire[] = [];
    let pushedStartStation = false;

    for (const horaire of horaires) {
      if (horaire.train_id !== train.id) continue;

      if (horaire.gare_id === startStationId) pushedStartStation = true;
      if (pushedStartStation) trainPath.push(horaire);

      if (horaire.gare_id === endStationId) break;
    }

    if (trainPath.length > 0 && trainPath.at(-1).gare_id === endStationId)
      pathsByTrain.push(trainPath);
  }

  return sortHoraires(pathsByTrain);
}

// This is just an optimized function, but it may return horaires that have a train_id that doesn't exist SO FILTER THEM!!
export function getStationsPaths2(
  horairesGroupedByTrain: IHoraire[][],
  startStationId: number,
  endStationId: number,
): IHoraire[][] {
  if (startStationId === endStationId)
    throw new Error('The stations can not be equivalent.');

  const paths = Array<IHoraire[]>();

  for (const horaires of horairesGroupedByTrain) {
    let horairesPath = Array<IHoraire>();
    let foundStart = false;

    for (const horaire of horaires) {
      if (horaire.gare_id === startStationId) {
        if (foundStart) horairesPath = [];
        foundStart = true;
      }

      if (foundStart) {
        horairesPath.push(horaire);
        if (horaire.gare_id === endStationId) break;
      }
    }

    if (
      horairesPath.length >= 2 &&
      horairesPath.at(-1).gare_id === endStationId
    )
      paths.push(horairesPath);
  }

  return sortHoraires(paths);
}

import { IGare } from './interfaces/IGare.js';
import { IHoraire } from './interfaces/IHoraire.js';

type TTrainPath = IHoraire[];
type TTrainPaths = TTrainPath[];
type TTrainCompoundPath = [TTrainPath, TTrainPath];

export function buildCompoundPath(
  middleGares: IGare[],
  getStationsPaths: (
    startStationId: number,
    endStationId: number,
  ) => TTrainPaths,
  startStationId: number,
  endStationId: number,
): TTrainCompoundPath[] {
  const pathsByMiddleGare = Array<[TTrainPaths, TTrainPaths]>();

  for (const middleGare of middleGares) {
    const firstPaths = getStationsPaths(startStationId, middleGare.id);
    const secondPaths = getStationsPaths(middleGare.id, endStationId);

    if (!firstPaths.length || !secondPaths.length) continue;

    pathsByMiddleGare.push([firstPaths, secondPaths]);
  }

  const allPossiblePaths: TTrainCompoundPath[] = pathsByMiddleGare.flatMap(
    path => {
      const [firstPaths, secondPaths] = path;

      return firstPaths.flatMap(a => {
        return secondPaths.reduce((acc, b) => {
          const timeDifference = 1; // b.at(0).timestamp - a.at(-1).timestamp;
          if (timeDifference >= 0) acc.push([a, b] as TTrainCompoundPath);

          return acc;
        }, Array<TTrainCompoundPath>());
      });
    },
  );

  return allPossiblePaths;
}

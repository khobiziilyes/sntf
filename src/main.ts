import {
  loadSNTFCSV,
  mappers,
  getStationsPaths2,
  buildCompoundPath,
  getPathDistances,
} from './SNTF_API/index.js';
import { IGare, IHoraire } from './SNTF_API/interfaces/index.js';
import { byId, groupBy } from './utils.js';

const annaba = 71;
const agha = 37;
const oran = 305;
const tlemcen = 424;
const kadiria = 551;
const draElMizan = 162;
const bouira = 126;
const lakhdaria = 251;

function toString(arr: IHoraire[][]): string[][] {
  return arr.map(_ =>
    _.map(_ => `${garesById[_.gare_id].names.fr} - ${_.time_str}`),
  );
}

/* const compoundPath = buildCompoundPath(
  garesByNext.get(oran),
  (a, b) => getStationsPaths2(horairesGroupedByTrain, a, b),
  annaba,
  oran,
).map(_ => toString(_)); */

const paths = getStationsPaths2(
  horairesGroupedByTrain,
  bouira,
  lakhdaria,
).filter(_ => trainsById[_[0].train_id]); // Interesting: gare_id

debugger;

/*
  const pricesByBareme = groupBy(prices, 'bareme_id');
  const garesByNext = gares.reduce((acc, gare) => {
    for (const next of gare.next) {
      acc.set(next, [...(acc.get(next) || []), gare]);
    }

    return acc;
  }, new Map<number, IGare[]>());
  const horairesGroupedByTrain = Object.values(groupBy(horaires, 'train_id')); */

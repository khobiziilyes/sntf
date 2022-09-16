import axios from 'axios';
import {
  getApiVersion,
  loadSNTFCSV,
  mappers,
  getStationsPaths2,
  buildCompoundPath,
  getPathDistances,
} from './SNTF_API/index.js';
import { IGare, IHoraire } from './SNTF_API/interfaces/index.js';
import { byId, groupBy } from './utils.js';

const SNTF_HOST = 'http://application.sntf.dz';
const apiVersion = await getApiVersion(SNTF_HOST);

const axiosClient = axios.default.create({
  baseURL: `${SNTF_HOST}/data/${apiVersion}/`,
  responseType: 'blob',
  transformResponse: _ => _,
});

const annaba = 71;
const agha = 37;
const oran = 305;
const tlemcen = 424;
const kadiria = 551;
const draElMizan = 162;
const bouira = 126;
const lakhdaria = 251;

function csvLoader<T>(dataName: string, mapper: (any) => T): Promise<T[]> {
  return loadSNTFCSV(axiosClient, dataName, mapper);
}

function toString(arr: IHoraire[][]): string[][] {
  return arr.map(_ =>
    _.map(_ => `${garesById[_.gare_id].names.fr} - ${_.time_str}`),
  );
}

const baremes = await csvLoader('baremes', mappers.baremeMapper);
const baremesById = byId(baremes, _ => _.id);

const prix = await csvLoader('prix', mappers.priceMapper);
const prixByBareme = groupBy(prix, 'bareme_id');

const gares = await csvLoader('gares', mappers.gareMapper);
const garesById = byId(gares, _ => _.id);
const garesByNext = gares.reduce((acc, gare) => {
  for (const next of gare.next) {
    acc.set(next, [...(acc.get(next) || []), gare]);
  }

  return acc;
}, new Map<number, IGare[]>());

const trains = (await csvLoader('trains', mappers.trainMapper)).filter(
  _ => _.published,
);
const trainsById = byId(trains, _ => _.id);

const horaires = (await csvLoader('horaires', mappers.horaireMapper)).sort(
  (a, b) => a.timestamp - b.timestamp,
);

const horairesGroupedByTrain = Object.values(groupBy(horaires, 'train_id'));

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

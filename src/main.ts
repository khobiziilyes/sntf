import axios from 'axios';

import {
  getApiVersion,
  loadSNTFCSV,
  mappers,
  getStationsPaths2,
} from './SNTF_API/index.js';
import { byId, groupBy } from './utils.js';

const SNTF_HOST = 'http://application.sntf.dz';
const apiVersion = await getApiVersion(SNTF_HOST);

const axiosClient = axios.default.create({
  baseURL: `${SNTF_HOST}/data/${apiVersion}/`,
  responseType: 'blob',
  transformResponse: (_) => _,
});

function csvLoader<T>(dataName: string, mapper: (any) => T): Promise<T[]> {
  return loadSNTFCSV(axiosClient, dataName, mapper);
}

// const baremes = await loadSNTFCSV('baremes', baremeMapper);
// const prix = await loadSNTFCSV('prix', priceMapper);
const gares = await csvLoader('gares', mappers.gareMapper);

const trains = (await csvLoader('trains', mappers.trainMapper)).filter(
  (_) => _.published,
);

const horaires = (await csvLoader('horaires', mappers.horaireMapper)).sort(
  (a, b) => a.timestamp - b.timestamp,
);

const garesById = byId(gares, (_) => _.id);
const horairesByTrainId = groupBy(horaires, 'train_id');
const trainsById = byId(trains, (_) => _.id);

// make sure they is different IDs.
const paths = getStationsPaths2(Object.values(horairesByTrainId), 37, 305)
  .filter((_) => trainsById[_[0].train_id])
  .map((_) => _.map((_) => `${garesById[_.gare_id].names.fr} - ${_.time_str}`));

debugger;

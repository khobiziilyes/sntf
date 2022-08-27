import axios from 'axios';
import { getApiVersion } from './SNTF_API/getApiVersion.js';
import { parseCsv } from './utils.js';

const SNTF_HOST = 'http://application.sntf.dz';
const apiVersion = await getApiVersion(SNTF_HOST);

const axiosClient = axios.default.create({
  baseURL: `${SNTF_HOST}/data/${apiVersion}/`,
  responseType: 'blob',
});

async function loadSNTFCSV<T>(dataName): Promise<T[]> {
  const { data } = await axiosClient.get(`${dataName}.csv`);
  return parseCsv<T>(data);
}

// const gares = await loadSNTFCSV<IGare>('gares');
// const trains = await loadSNTFCSV<ITrain>('trains');
// const horaires = await loadSNTFCSV<IHoraire>('horaires');
// const baremes = await loadSNTFCSV<IBareme>('baremes');
// const prix = await loadSNTFCSV<IBareme>('prix');

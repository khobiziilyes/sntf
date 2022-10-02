// Oct 1, 10:26:46 AM: 1753368d Duration: 8681.65 ms	Memory Usage: 103 MB	Init Duration: 213.89 ms
// This function takes about 9 seconds to update the data, which is close to netlify limits (10s).
// Therefore, some kind of optimization must be made.

import * as functions from 'firebase-functions';
import axios from 'axios';
import { getApiVersion } from './SNTF_API/getApiVersion.js';
import { loadSNTFCSV } from './SNTF_API/loadSNTFCSV.js';
import { mappers } from './SNTF_API/index.js';
import { firestore } from './firestore.js';

const { SNTF_HOST } = process.env;

const versionDocRef = firestore.collection('versions').doc('0');

async function getDBVersionInfo(): Promise<{
  lastDBVersion: number;
  secondsDiff: number;
} | null> {
  return versionDocRef.get().then(docSnapshot =>
    docSnapshot.exists
      ? versionDocRef.get().then(doc => ({
          secondsDiff: Math.floor(Date.now() / 1000) - doc.updateTime.seconds,
          lastDBVersion: doc.data().versionNumber,
        }))
      : null,
  );
}

async function setDBVersionInfo(versionNumber: number): Promise<void> {
  await versionDocRef.set({
    versionNumber,
  });
}

async function loadItemsToCollection(
  collection_name: string,
  arr: any[],
): Promise<void> {
  // TODO: use batch creation instead.
  const collection = firestore.collection(collection_name);
  await Promise.all(arr.map(doc => collection.doc(doc.id + '').set(doc)));
}

async function getApiData(
  versionNumber: number,
): Promise<{ [key: string]: any }> {
  const axiosClient = axios.default.create({
    baseURL: `${SNTF_HOST}/data/${versionNumber}/`,
    responseType: 'blob',
    transformResponse: _ => _,
  });

  /* const baremes = await loadSNTFCSV(
    axiosClient,
    'baremes',
    mappers.baremeMapper,
  );

  const prices = await loadSNTFCSV(axiosClient, 'prix', mappers.priceMapper);
  */

  const gares = await loadSNTFCSV(axiosClient, 'gares', mappers.gareMapper);

  const trains = (
    await loadSNTFCSV(axiosClient, 'trains', mappers.trainMapper)
  ).filter(_ => _.published);

  const horaires = (
    await loadSNTFCSV(axiosClient, 'horaires', mappers.horaireMapper)
  ).sort((a, b) => a.timestamp - b.timestamp); // TODO: Should filter by existing train_id ONLY

  return {
    gares,
    // baremes,
    // prices,
    trains,
    horaires,
  };
}

export async function versionUpdater(): Promise<void> {
  const dbVersionInfo = await getDBVersionInfo();
  const shouldReCheck =
    !dbVersionInfo || dbVersionInfo.secondsDiff > 6 * 60 * 60; // 6 hours

  if (!shouldReCheck) return;
  console.info('Executing version updater ...');

  const latestApiVersion = await getApiVersion(process.env.SNTF_HOST);
  if (dbVersionInfo?.lastDBVersion === latestApiVersion) return;

  const latestData = await getApiData(latestApiVersion);

  for (const [collection_name, arr] of Object.entries(latestData)) {
    await loadItemsToCollection(collection_name, arr);
  }

  await setDBVersionInfo(latestApiVersion);
}

export function updaterWrapper(handler: any) {
  return async (request, response) => {
    await versionUpdater();

    console.info('Calling the handler ...');
    return handler(request, response);
  };
}

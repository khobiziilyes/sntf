// Oct 1, 10:26:46 AM: 1753368d Duration: 8681.65 ms	Memory Usage: 103 MB	Init Duration: 213.89 ms
// This function takes about 9 seconds to update the data, which is close to netlify limits (10s).
// Therefore, some kind of optimization must be made.

import axios from 'axios';
import { Handler, schedule } from '@netlify/functions';
import faunadb from 'faunadb';
import { faunaClient } from '../faunaClient.js';
import { getApiVersion } from '../SNTF_API/getApiVersion.js';
import { loadSNTFCSV } from '../SNTF_API/loadSNTFCSV.js';
import { mappers } from '../SNTF_API/index.js';

const {
  Collection,
  Get,
  Lambda,
  Let,
  Now,
  Select,
  Subtract,
  ToMicros,
  ToMillis,
  Var,
  Map,
  Create,
  Ref,
  CreateCollection,
  Update,
  Exists,
  If,
} = faunadb;

const { SNTF_HOST } = process.env;

const versionsCollectionObj = Collection('versions');
const versionDocRef = Ref(versionsCollectionObj, '0');

async function getDBVersionInfo(): Promise<{
  lastDBVersion: number;
  timeDiffInMs: number;
} | null> {
  // prettier-ignore
  const data: any[] | null = await faunaClient.query(
    If(
      Exists(versionDocRef),
      Let({ 'doc': Get(versionDocRef)},
        [
          Select(['data', 'versionNumber'], Var('doc')),
          ToMillis(Subtract(ToMicros(Now()), Select('ts', Var('doc')))),
        ]
      ),
      null
    )
  );

  return data
    ? {
        lastDBVersion: data[0],
        timeDiffInMs: data[1],
      }
    : null;
}

async function setDBVersionInfo(versionNumber: number): Promise<void> {
  const newDoc = {
    data: {
      versionNumber,
    },
  };

  // prettier-ignore
  await faunaClient.query(
    If(
      Exists(versionsCollectionObj),
      null,
      CreateCollection({ name: 'versions' })
    )
  )
  // prettier-ignore
  await faunaClient.query(
    If(
      Exists(versionDocRef),
      Update(versionDocRef, newDoc),
      Create(versionDocRef, newDoc)
    )
  )
}

async function loadItemsToCollection(
  collection_name: string,
  arr: any[],
): Promise<void> {
  await faunaClient.query(CreateCollection({ name: collection_name }));
  // prettier-ignore
  await faunaClient.query(
    Map(
      arr.map(_ => [_.id, _]),
      Lambda(['theId', 'data'],
      Let({
        doc: Create(
            Ref(Collection(collection_name), Var('theId')),
            { data: Var('data') }
          )
        }, {})
      )
    )
  )
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
  ); */

  // const prices = await loadSNTFCSV(axiosClient, 'prix', mappers.priceMapper);
  const gares = await loadSNTFCSV(axiosClient, 'gares', mappers.gareMapper);

  const trains = (
    await loadSNTFCSV(axiosClient, 'trains', mappers.trainMapper)
  ).filter(_ => _.published);

  const horaires = (
    await loadSNTFCSV(axiosClient, 'horaires', mappers.horaireMapper)
  ).sort((a, b) => a.timestamp - b.timestamp); // TODO: Should filter by existing train_id ONLY */

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
    !dbVersionInfo || dbVersionInfo.timeDiffInMs > 6 * 60 * 60 * 1000; // 6 hours

  if (!shouldReCheck) return;

  const latestApiVersion = await getApiVersion(process.env.SNTF_HOST);
  if (dbVersionInfo?.lastDBVersion === latestApiVersion) return;

  const latestData = await getApiData(latestApiVersion);

  for (const [collection_name, arr] of Object.entries(latestData)) {
    await loadItemsToCollection(`${collection_name}_${latestApiVersion}`, arr);
  }

  await setDBVersionInfo(latestApiVersion);
}

export function updaterWrapper(handler: Handler) {
  return async (...args: [any, any, any]) => {
    await versionUpdater();
    return await handler(...args);
  };
}

async function scheduler() {
  await versionUpdater();

  return {
    statusCode: 200,
  };
}

export const handler = schedule('@hourly', scheduler);

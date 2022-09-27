import axios from 'axios';
import { Handler } from '@netlify/functions';
import {
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
} from 'faunadb';
import { faunaClient } from './faunaClient.js';
import { getApiVersion } from '../SNTF_API/getApiVersion.js';
import { loadSNTFCSV } from '../SNTF_API/loadSNTFCSV.js';
import { mappers } from '../SNTF_API/index.js';

const { SNTF_HOST } = process.env;
const versionDocRef = Ref(Collection('versions'), '0');

async function getDBVersionInfo(): Promise<{
  lastDBVersion: number;
  timeDiffInMs: number;
} | null> {
  // prettier-ignore
  const data: any[] | null = await faunaClient.query(
    If(
      Exists(versionDocRef),
      Let(
        {
          'doc': Get(versionDocRef)
        },
        [
          Select(['data', 'versionNumber'], Var('doc')),
          ToMillis(Subtract(ToMicros(Now()), Select('ts', Var('doc')))),
        ]
      ),
      null
    )
  );

  if (!data) return null;

  const [lastDBVersion, timeDiffInMs] = data;

  return {
    lastDBVersion,
    timeDiffInMs,
  };
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
        Create(
          Ref(Collection(collection_name), Var('theId')),
          { data: Var('data') }
        )
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

  const baremes = await loadSNTFCSV(
    axiosClient,
    'baremes',
    mappers.baremeMapper,
  );

  // const prices = await loadSNTFCSV(axiosClient, 'prix', mappers.priceMapper);
  // const gares = await loadSNTFCSV(axiosClient, 'gares', mappers.gareMapper);

  /* const trains = (
    await loadSNTFCSV(axiosClient, 'trains', mappers.trainMapper)
  ).filter(_ => _.published); */

  /* const horaires = (
    await loadSNTFCSV(axiosClient, 'horaires', mappers.horaireMapper)
  ).sort((a, b) => a.timestamp - b.timestamp); // Should filter by existing train_id ONLY */

  return {
    // gares,
    baremes,
    // prices,
    // trains,
    // horaires,
  };
}

export const handler: Handler = async () => {
  const dbVersionInfo = await getDBVersionInfo();
  const isUpToDate =
    dbVersionInfo !== null && dbVersionInfo.timeDiffInMs < 6 * 60 * 60 * 1000; // 6 hours

  if (isUpToDate)
    return {
      statusCode: 200,
      body: 'UPTODATE BABY!!!',
    };

  const latestApiVersion = await getApiVersion(process.env.SNTF_HOST);
  const latestData = await getApiData(latestApiVersion);

  for (const [collection_name, arr] of Object.entries(latestData)) {
    await loadItemsToCollection(`${collection_name}_${latestApiVersion}`, arr);
  }

  await setDBVersionInfo(latestApiVersion);

  return {
    statusCode: 200,
    body: 'We good',
  };
};

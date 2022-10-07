import * as functions from 'firebase-functions';
import { updaterWrapper } from './versionUpdater.js';
import { firestore } from './firestore.js';
import { getStationsPaths2 } from './SNTF_API/index.js';

// TODO: Send the job to the background, set the DB_LOADING = true, and return a response.

async function _getPath(req: functions.https.Request, res: functions.Response) {
  const { startStation, destinationStation } = (req.query as any) || {};

  const startStationId = Number.parseInt(startStation);
  const destinationStationId = Number.parseInt(destinationStation);

  if (
    !startStationId ||
    !destinationStationId ||
    isNaN(startStationId) ||
    isNaN(destinationStationId)
  )
    return res.status(404).send();

  const horairesGroupedByTrain = await firestore
    .collection('horairesGroupedByTrain')
    .where('gares', 'array-contains-any', [
      startStationId + '-' + destinationStationId,
      destinationStationId + '-' + startStationId,
    ])
    .get()
    .then(_ => _.docs.map(_ => (_.data() as any).horaires));

  const paths = getStationsPaths2(
    horairesGroupedByTrain,
    +startStationId,
    +destinationStationId,
  );

  return res.status(200).send(paths);
}

export const getPath = functions
  .region('europe-west2')
  .runWith({ timeoutSeconds: 530, memory: '1GB' })
  .https.onRequest(updaterWrapper(_getPath));

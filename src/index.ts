import * as functions from 'firebase-functions';
import { updaterWrapper } from './versionUpdater.js';

async function _getFirstHoraire(_req, res) {
  res.send('We good so far.');
}

export const getFirstHoraire = functions
  .region('europe-west2')
  .runWith({ timeoutSeconds: 530, memory: '1GB' })
  .https.onRequest(updaterWrapper(_getFirstHoraire));

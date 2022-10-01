import { updaterWrapper } from './versionUpdater.js';

async function _getFirstHoraire(_req, res) {
  res.send('We good so far.');
}

export const getFirstHoraire = updaterWrapper(_getFirstHoraire);

import { Handler } from '@netlify/functions';
import { updaterWrapper } from './versionUpdater.js';

const unWrapperHandler: Handler = async () => {
  return {
    statusCode: 200,
    body: 'WE GOOD!!',
  };
};

export const handler = updaterWrapper(unWrapperHandler);

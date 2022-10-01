import * as dotenv from 'dotenv';
dotenv.config();

import faunadb from 'faunadb';

const { FAUNA_DB_SECRET } = process.env;

export const faunaClient = new faunadb.Client({
  secret: FAUNA_DB_SECRET,
});

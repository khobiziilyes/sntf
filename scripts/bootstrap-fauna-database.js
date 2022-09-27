import * as dotenv from 'dotenv';
dotenv.config();
import faunadb from 'faunadb';

const q = faunadb.query;

const { FAUNA_DB_SECRET } = process.env;

if (!FAUNA_DB_SECRET) {
  console.log('Fauna secret is missing ...');
} else {
  const client = new faunadb.Client({
    secret: FAUNA_DB_SECRET,
  });

  // prettier-ignore
  Promise.resolve(client)
    // .then(dropCollections)
    .then(createFaunaDB)
    .then(addSomeData);
}

async function dropCollections(client) {
  const ref = q.Collection('horaires');
  const refs = [ref];

  // prettier-ignore
  await client.query(
    q.Let(
      {
        arr: q.Filter(refs,
          q.Lambda('ref',
            q.Exists(q.Var('ref'))
          )
        )
      },
      q.Map(q.Var('arr'),
        q.Lambda('ref',
          q.Delete(q.Var('ref'))
        )
      )
    )
  );

  return client;
}

async function addSomeData(client) {
  const horaires = [
    {
      data: {
        a: 'b',
      },
    },
    {
      data: {
        a: 'b',
      },
    },
  ];

  await client.query(
    q.Map(
      horaires,
      q.Lambda('data', q.Create(q.Collection('horaires'), q.Var('data'))),
    ),
  );

  return client;
}

async function createFaunaDB(client) {
  // prettier-ignore
  await client.query(
    q.Do(
      q.CreateCollection({ name: 'versions' }),
      q.CreateCollection({ name: 'horaires' })
    )
  );
  /* .then(() =>
      client.query(
        q.Create(q.Ref('indexes'), {
          name: 'allHoraires',
          source: q.Collection('horaires'),
        }),
      ),
    ) */

  return client;
}

const faunadb = require('faunadb');
const q = faunadb.query;

const { FAUNA_DB_SECRET } = process.env;

if (!FAUNA_DB_SECRET) {
  console.log('Fauna secret is missing ...');
} else {
  createFaunaDB(FAUNA_DB_SECRET).then(() => {
    console.log('Database created');
  });
}

function createFaunaDB(key) {
  const client = new faunadb.Client({
    secret: key,
  });

  return client
    .query(q.Create(q.Ref('classes'), { name: 'todos' }))
    .then(() => {
      return client.query(
        q.Create(q.Ref('indexes'), {
          name: 'all_todos',
          source: q.Ref('classes/todos'),
        }),
      );
    })
    .catch(e => {
      if (
        e.requestResult.statusCode === 400 &&
        e.message === 'instance not unique'
      ) {
        console.log('DB already exists');
        throw e;
      }
    });
}

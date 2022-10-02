import { sleep } from './utils.js';
import { firestore } from './firestore.js';
import { versionUpdater } from './versionUpdater.js';

/* const sleepMinute = () => sleep(61 * 1000); // 1 extra second just to be sure.

// prettier-ignore
Promise.resolve()
    .then(databaseDown)
    .then(sleepMinute)
    .then(databaseUp)
    .then(versionUpdater);

async function databaseDown() {
  // prettier-ignore
  await faunaClient.query(
    Map(
      Paginate(Collections()),
      Lambda("col_name",
        Delete(Var("col_name"))
      )
    )
  );
}

async function databaseUp() {
  return;

  // TODO: create the indexes
  // prettier-ignore
  await faunaClient.query(
    Do(
      // CreateCollection({ name: 'versions' })
    )
  );
}
*/

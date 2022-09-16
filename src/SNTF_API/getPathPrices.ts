// Not working properly yet due to bugs in the official app
// https://www.linkedin.com/feed/update/urn:li:activity:6974740773229477888/

import { getPathDistances } from './getPathDistances.js';

export function getPathPrices(paths, trainsById, baremesById, prixByBareme) {
  const pathsTrains = paths.map(_ => trainsById[_[0].train_id]); // Interesting: bareme_id
  // const pathsGares = paths.map(_ => _.map(_ => garesById[_.gare_id])); // Interesting: Nothing.
  // const trainsTaxes = pathsTrains.map(_ => baremesById[_.bareme_id].taxes); // Interesing: Nothing.
  const baremesPrices = pathsTrains.map(_ => prixByBareme[_.bareme_id]);

  const distances = paths.map(getPathDistances);

  const distancesPrices = distances.map((_, i) => {
    const relevantPrices = baremesPrices[i];

    return _.map(_ => {
      const shouldInclude = relevantPrices.filter(price => price.classe === 2); // && price.distances.includes(_)

      // if (shouldInclude.length > 1) throw new Error('!!!!!');

      return shouldInclude;
    });
  });

  return distancesPrices;
}

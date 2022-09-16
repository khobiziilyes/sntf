import { AxiosInstance } from 'axios';
import { parse } from 'csv-parse';
import { parseNullableString } from '../utils.js';

export async function loadSNTFCSV<T>(
  axiosClient: AxiosInstance,
  dataName,
  mapper: (any) => T,
): Promise<T[]> {
  const { data } = await axiosClient.get(`${dataName}.csv`);

  const promise = new Promise<{ [key: string]: string }[]>(
    (resolve, reject) => {
      parse(
        data,
        { columns: true, relax_column_count: true },
        (err, records) => {
          if (err) return reject();
          return resolve(records);
        },
      );
    },
  );

  return (await promise)
    .map(elem =>
      Object.fromEntries(
        Object.entries(elem).map(entry => [
          entry[0],
          parseNullableString(entry[1].trim()),
        ]),
      ),
    )
    .map(mapper);
}

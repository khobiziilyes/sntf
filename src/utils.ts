import csv from 'csvtojson';

const csvParser = csv();

export async function parseCsv<T>(str: string): Promise<T[]> {
  return await csvParser.fromString(str);
}

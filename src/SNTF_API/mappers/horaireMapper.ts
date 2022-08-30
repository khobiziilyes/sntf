import { IHoraire, IRawHoraire } from '../interfaces/IHoraire.js';

function booleanString(str: string): boolean {
  return str === '1';
}

export function horaireMapper(obj: IRawHoraire): IHoraire {
  const splitedTime = obj.heure.split(':');

  const timestamp = splitedTime.reduce(
    (acc, item, i) => acc + +item * Math.pow(60, splitedTime.length - 1 - i),
    0,
  );

  return {
    id: +obj.id,
    train_id: +obj.train_id,
    gare_id: +obj.gare_id,
    time: new Date(),
    available_tomorrow: booleanString(obj.jour_suivant),
    distance: +obj.distance,
    time_str: obj.heure,
    timestamp,
  };
}

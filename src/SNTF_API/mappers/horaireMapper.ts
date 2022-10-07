import { IHoraire, IRawHoraire } from '../interfaces/IHoraire.js';

function booleanString(str: string): boolean {
  return str === '1';
}

export function horaireMapper(obj: IRawHoraire): IHoraire {
  const splitedTime = obj.heure.split(':');
  const is_time_tomorrow = booleanString(obj.jour_suivant);

  const timestamp = splitedTime.reduce(
    (acc, item, i) => acc + +item * Math.pow(60, splitedTime.length - 1 - i),
    is_time_tomorrow ? 24 * 60 * 60 : 0,
  );

  return {
    id: +obj.id,
    train_id: +obj.train_id,
    gare_id: +obj.gare_id,
    time: new Date(),
    is_time_tomorrow,
    distance: +obj.distance,
    time_str: splitedTime.slice(0, -1).join(':'),
    timestamp,
  };
}

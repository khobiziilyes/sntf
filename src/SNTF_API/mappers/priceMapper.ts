import { IPrix, IRawPrix } from '../interfaces/IPrix.js';

export function priceMapper(obj: IRawPrix): IPrix {
  return {
    id: +obj.id,
    bareme_id: +obj.bareme_id,
    classe_id: +obj.classe,
    distances: [],
    reductions: [],
  };
}

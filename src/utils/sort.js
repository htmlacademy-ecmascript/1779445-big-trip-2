import { TripSort } from '../const.js';
import dayjs from 'dayjs';

export function changeSortType(points, target) {
  if(!points) {
    return [];
  }

  const sort = {
    [TripSort.DAY.slice(0)]: [...points].sort((a, b) => dayjs(a.dateFrom).diff(b.dateFrom)),
    [TripSort.PRICE.slice(0)]: [...points].sort((a, b) => b.basePrice - a.basePrice),
    [TripSort.TIME.slice(0)]: [...points].sort((a, b) => dayjs(dayjs(a.dateFrom).diff(a.dateTo)).diff(dayjs(b.dateFrom).diff(b.dateTo))),
  };

  return sort[target] || (() => []);
}

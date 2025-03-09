import { TripSort } from '../const.js';

import dayjs from 'dayjs';

export function changeSortType(points, target){

  switch (target) {
    case TripSort.PRICE.slice(0):
      return points.sort((a, b) => b.basePrice - a.basePrice);

    case TripSort.TIME.slice(0):
      return points.sort((a, b) => {
        const date1 = dayjs(b.dateFrom).diff(b.dateTo);
        const date2 = dayjs(a.dateFrom).diff(a.dateTo);
        return dayjs(date2).diff(date1);
      });

    default:
      return points.sort((a, b) => dayjs(a.dateFrom).diff(b.dateFrom));
  }
}

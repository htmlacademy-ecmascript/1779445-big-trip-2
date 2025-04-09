import { TripSort } from '../const.js';
import dayjs from 'dayjs';

export function changeSortType(points, target) {
  if(!points) {
    return [];
  }

  const sort = {
    [TripSort.DAY.slice(0)]: [...points].sort((earlierPoint, laterPoint) => dayjs(earlierPoint.dateFrom).diff(laterPoint.dateFrom)),
    [TripSort.PRICE.slice(0)]: [...points].sort((higherPricePoint, lowerPricePoint) => lowerPricePoint.basePrice - higherPricePoint.basePrice),
    [TripSort.TIME.slice(0)]: [...points].sort((longerEvent, shorterEvent) => dayjs(dayjs(longerEvent.dateFrom).diff(longerEvent.dateTo)).diff(dayjs(shorterEvent.dateFrom).diff(shorterEvent.dateTo))),
  };

  return sort[target] || (() => []);
}

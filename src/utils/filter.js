import { FilterType } from '../const.js';
const todayDay = '2019-08-11';

export function filterByTimePeriod(points, target) {
  if(!points) {
    return [];
  }

  const filter = {
    [FilterType.EVERYTHING]: points,
    [FilterType.FUTURE]: points.filter((point) =>(point.dateFrom).slice(0, 10) > todayDay),
    [FilterType.PAST]: points.filter((point) =>(point.dateFrom).slice(0, 10) < todayDay),
    [FilterType.PRESENT]: points.filter((point) =>(point.dateFrom).slice(0, 10) === todayDay),
  };

  return filter[target] || (() => []);
}

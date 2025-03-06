import { FilterType } from '../const.js';
const todayDay = '2019-08-11';

export function changeFilters(points, target){

  switch (target) {
    case FilterType.FUTURE:
      return points.filter((point) =>(point.dateFrom).slice(0, 10) > todayDay);

    case FilterType.PAST:
      return points.filter((point) =>(point.dateFrom).slice(0, 10) < todayDay);

    case FilterType.PRESENT:
      return points.filter((point) =>(point.dateFrom).slice(0, 10) === todayDay);

    default:
      return points;
  }
}

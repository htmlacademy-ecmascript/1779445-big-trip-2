import { FilterType } from '../const.js';
const todayDay = '2019-08-11';

function changeFilters(points, target){
  switch (target) {
    case FilterType.FUTURE.slice(0):
      return points.filter((point) =>(point.dateFrom).slice(0, 10) > todayDay);

    case FilterType.PAST.slice(0):
      return points.filter((point) =>(point.dateFrom).slice(0, 10) < todayDay);

    case FilterType.PRESENT.slice(0):
      return points.filter((point) =>(point.dateFrom).slice(0, 10) === todayDay);

    default:
      return points;
  }
}

function checkDisabled(points) {
  const activeFilters = {
    [FilterType.EVERYTHING]: points.length > 0,
    [FilterType.FUTURE]: points.some((point) =>(point.dateFrom).slice(0, 10) > todayDay),
    [FilterType.PAST]: points.some((point) =>(point.dateFrom).slice(0, 10) < todayDay),
    [FilterType.PRESENT]: points.some((point) =>(point.dateFrom).slice(0, 10) === todayDay),

  };
  return activeFilters;
}
export { changeFilters, checkDisabled };

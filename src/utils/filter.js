import dayjs from 'dayjs';
const todayDay = dayjs().format('YYYY-MM-DD');

const FILTERS = {
  everything: {
    type: 'everything',
    filterFn: (points) => points,
    isChecked: false,
  },
  future: {
    type: 'future',
    filterFn: (points) => points.filter((item) => item.dateFrom.slice(0, 10) > todayDay),
    isChecked: false,
  },
  past: {
    type: 'past',
    filterFn: (points) => points.filter((item) => item.dateFrom.slice(0, 10) < todayDay),
    isChecked: false,
  },
  present: {
    type: 'present',
    filterFn: (points) => points.filter((item) => item.dateFrom.slice(0, 10) === todayDay),
    isChecked: false,
  }
};

function filterByTimePeriod(points, target = 'everything') {
  if (!Array.isArray(points)) {
    return [];
  }

  const filter = FILTERS[target] || FILTERS.everything;

  return {
    type: filter.type,
    points: filter.filterFn(points),
  };
}

export { FILTERS, filterByTimePeriod };

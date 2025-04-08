import dayjs from 'dayjs';

const FILTERS = {
  everything: {
    type: 'everything',
    filterFn: (points) => points,
    isChecked: false,
  },
  future: {
    type: 'future',
    filterFn: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
    isChecked: false,
  },
  present: {
    type: 'present',
    filterFn: (points) => points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs())),
    isChecked: false,
  },
  past: {
    type: 'past',
    filterFn: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
    isChecked: false,
  },
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

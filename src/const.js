const DATE_FORMAT_DAY = 'MMM D';
const DATE_FORMAT_TIME = 'MM:DD';
const DATE_FORMAT_TIME_EDITFORM = 'YY/MM/DD hh:mm';

const FilterType = {
  EVERYTHING:'everything',
  FUTURE:'future',
  PRESENT:'present',
  PAST:'past',
};

const TripSort = {
  DAY:'sort-day',
  EVENT:'sort-event',
  TIME:'sort-time',
  PRICE:'sort-price',
  OFFERS:'sort-offers',
};

const EventType = {
  TAXI:'taxi',
  BUS:'bus',
  TRAIN:'train',
  SHIP:'ship',
  DRIVE:'drive',
  FLIGHT:'flight',
  CHECKIN:'check-in',
  SIGHTSEEING:'sightseeing',
  RESTARAUNT:'restaurant',
};

const DestinationType = {
  TOKYO: 'Tokyo',
  GENEVA: 'Geneva',
  AMSTERDAM: 'Amsterdam',
  CHAMONIX: 'Chamonix',
};

const FilterEmptyPoints = {
  EVERYTHING:'Click New Event to create your first point',
  FUTURE:'There are no future events now',
  PRESENT:'There are no present events now',
  PAST:'There are no past events now',
};

export {
  DATE_FORMAT_DAY,
  DATE_FORMAT_TIME,
  DATE_FORMAT_TIME_EDITFORM,
  FilterType,
  TripSort,
  EventType,
  FilterEmptyPoints,
  DestinationType,
};

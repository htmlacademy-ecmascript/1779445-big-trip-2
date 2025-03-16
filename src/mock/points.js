import { mockDestination } from '../mock/destination.js';
import { mockOffers } from '../mock/offers.js';
import { nanoid } from 'nanoid';
const mockPoints = [
  {
    id: nanoid(),
    basePrice: 20,
    dateFrom: '2019-07-11T05:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: mockDestination[0],
    isFavorite: true,
    offers: mockOffers[0],
    type: 'taxi',
  },
  {
    id: nanoid(),
    basePrice: 600,
    dateFrom: '2019-08-11T02:55:56.845Z',
    dateTo: '2019-08-11T12:22:13.375Z',
    destination: mockDestination[1],
    isFavorite: false,
    offers: mockOffers[3],
    type: 'check-in',
  },
  {
    id: nanoid(),
    basePrice: 160,
    dateFrom: '2019-09-13T12:55:56.845Z',
    dateTo: '2019-09-13T13:22:13.375Z',
    destination: mockDestination[2],
    isFavorite: false,
    offers: mockOffers[2],
    type: 'flight',
  },
  {
    id: nanoid(),
    basePrice: 50,
    dateFrom: '2019-10-14T02:55:56.845Z',
    dateTo: '2019-10-15T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[1],
    type: 'Sightseeing',
  },
  {
    id: nanoid(),
    basePrice: 20,
    dateFrom: '2019-10-14T01:55:56.845Z',
    dateTo: '2019-10-15T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[4],
    type: 'Drive',
  },
  {
    id: nanoid(),
    basePrice: 50,
    dateFrom: '2019-10-15T12:55:56.845Z',
    dateTo: '2019-10-16T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[1],
    type: 'Sightseeing',
  },
];


export { mockPoints };

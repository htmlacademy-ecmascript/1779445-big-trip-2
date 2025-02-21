import { mockDestination } from '../mock/destination.js';
import { mockOffers } from '../mock/offers.js';

const mockPoints = [
  {
    id: '1',
    basePrice: 20,
    dateFrom: '2019-07-11T05:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: mockDestination[0],
    isFavorite: true,
    offers: mockOffers[0],
    type: 'taxi',
  },
  {
    id: '2',
    basePrice: 600,
    dateFrom: '2019-08-11T23:55:56.845Z',
    dateTo: '2019-08-12T12:22:13.375Z',
    destination: mockDestination[1],
    isFavorite: false,
    offers: mockOffers[3],
    type: 'check-in',
  },
  {
    id: '3',
    basePrice: 160,
    dateFrom: '2019-09-13T12:55:56.845Z',
    dateTo: '2019-09-13T13:22:13.375Z',
    destination: mockDestination[2],
    isFavorite: false,
    offers: mockOffers[2],
    type: 'flight',
  },
  {
    id: '4',
    basePrice: 50,
    dateFrom: '2019-10-14T02:55:56.845Z',
    dateTo: '2019-10-15T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[1],
    type: 'Sightseeing',
  },
  {
    id: '5',
    basePrice: 20,
    dateFrom: '2019-10-14T01:55:56.845Z',
    dateTo: '2019-10-15T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[4],
    type: 'Drive',
  },
  {
    id: '4',
    basePrice: 50,
    dateFrom: '2019-10-14T12:55:56.845Z',
    dateTo: '2019-10-15T14:22:13.375Z',
    destination: mockDestination[3],
    isFavorite: true,
    offers: mockOffers[1],
    type: 'Sightseeing',
  },
];


export { mockPoints };

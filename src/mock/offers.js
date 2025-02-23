
import { getRandomNumber } from '../util.js';

const mockOffers = [
  {
    type: 'Taxi',
    offers: [
      {
        id: '1',
        title: 'Order Uber',
        price: getRandomNumber(),
      },
      {
        id: '2',
        title: 'Order Yandex',
        price: getRandomNumber(),
      },
      {
        id: '3',
        title: 'Order Maxim',
        price: getRandomNumber(),
      }
    ]
  },
  {
    type: 'Sightseeing',
    offers: [
      {
        id: '4',
        title: 'Book tickets',
        price: getRandomNumber(),
      },
      {
        id: '5',
        title: 'Lunch in city',
        price: getRandomNumber(),
      },
      {
        id: '5',
        title: 'Add coffe',
        price: getRandomNumber(),
      }
    ]
  },
  {
    type: 'Flight',
    offers: [
      {
        id: '6',
        title: 'Add luggage',
        price: getRandomNumber(),
      },
      {
        id: '7',
        title: 'Add meal',
        price: getRandomNumber(),
      },
      {
        id: '8',
        title: 'Choose seats',
        price: getRandomNumber(),
      }
    ]
  },
  {
    type: 'Check-in',
    offers: [
      {
        id: '9',
        title: 'Add breakfast',
        price: getRandomNumber(),
      },
      {
        id: '10',
        title: 'Add pool ticket',
        price: getRandomNumber(),
      }
    ]
  },
  {
    type: 'Drive',
    offers: []
  },
];

export { mockOffers };

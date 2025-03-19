
import { getRandomNumber } from '../utils/common.js';
import { nanoid } from 'nanoid';

const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: nanoid(),
        title: 'Order Uber',
        price: getRandomNumber(),
        checked: false
      },
      {
        id: nanoid(),
        title: 'Order Yandex',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Order Maxim',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: nanoid(),
        title: 'Buy ticket',
        price: getRandomNumber(),
        checked: false,
      },
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: nanoid(),
        title: 'Choose the Hogwarts Express',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Choose lastochka',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Choose shinkansen',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: nanoid(),
        title: 'Choose underwater room',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Visit Spongebob',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Don\'t sail on the Titanic',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'drive',
    offers: []
  },
  {
    type: 'flight',
    offers: [
      {
        id: nanoid(),
        title: 'Add luggage',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Add meal',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Choose seats',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: nanoid(),
        title: 'Add breakfast',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id:  nanoid(),
        title: 'Add pool ticket',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: nanoid(),
        title: 'Book tickets',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Lunch in city',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Add coffe',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: nanoid(),
        title: 'Order truffles',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Order a steak',
        price: getRandomNumber(),
        checked: false,
      },
      {
        id: nanoid(),
        title: 'Order coffe',
        price: getRandomNumber(),
        checked: false,
      }
    ]
  },
];

export { mockOffers };

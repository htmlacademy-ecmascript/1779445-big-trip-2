import { getRandomNumber } from '../utils/common.js';
import { nanoid } from 'nanoid';

const mockDestination = [
  {
    id: nanoid(),
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber()}`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: nanoid(),
    description: 'Geneva, is a beautiful city, a true asian pearl, with crowded streets. Beautiful city, a true asian pearl, with crowded streets.',
    name: 'Geneva',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber}`,
        description: 'Geneva parliament building'
      }
    ]
  },
  {
    id: nanoid(),
    description: 'Amsterdam, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Amsterdam',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber}`,
        description: 'Amsterdam parliament building'
      }
    ]
  },
  {
    id: nanoid(),
    description: 'Tokyo, is a beautiful city, a true asian pearl, with crowded streets. Beautiful city, a true asian pearl, with crowded streets.',
    name: 'Tokyo',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber}`,
        description: 'Tokyo parliament building'
      }
    ]
  },
];

export { mockDestination };

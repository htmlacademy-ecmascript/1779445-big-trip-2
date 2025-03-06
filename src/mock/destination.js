import { getRandomNumber } from '../utils/common.js';

const mockDestination = [
  {
    id: '1',
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
    id: '2',
    description: 'Geneva, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Geneva',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber}`,
        description: 'Geneva parliament building'
      }
    ]
  },
  {
    id: '3',
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
    id: '4',
    description: 'Tokyo, is a beautiful city, a true asian pearl, with crowded streets.',
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

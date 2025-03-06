import { mockPoints } from '../mock/points.js';
import { getRandomArrayElement } from '../utils/common.js';
import { nanoid } from 'nanoid';

function getRandomPoint(){
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints)
  };
}


export { getRandomPoint };

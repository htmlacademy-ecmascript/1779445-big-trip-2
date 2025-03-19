import { mockPoints } from '../mock/points.js';
import { getRandomArrayElement } from '../utils/common.js';

function getRandomPoint(){
  return {...getRandomArrayElement(mockPoints)
  };
}


export { getRandomPoint };

import { mockPoints } from '../mock/points.js';
import { getRandomArrayElement } from '../util.js';

function getRandomPoint(){
  return getRandomArrayElement(mockPoints);
}
export { getRandomPoint };

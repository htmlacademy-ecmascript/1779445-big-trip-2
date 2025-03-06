import { getRandomPoint } from '../mock/createPoint.js';
import { getRandomNumber } from '../utils/common.js';
const POINT_COUNT = getRandomNumber(10);

export default class PointModel {
  #points = Array.from({ length: POINT_COUNT}, getRandomPoint);

  get points(){
    return this.#points;
  }
}

import { getRandomPoint } from '../mock/createPoint.js';
import { getRandomNumber } from '../util.js';
const POINT_COUNT = getRandomNumber(10);

export default class PointModel {
  points = Array.from({ length: POINT_COUNT}, getRandomPoint);

  getPoint(){
    return this.points;
  }
}

import { getRandomPoint } from '../mock/createPoint.js';
import { getRandomNumber } from '../utils/common.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

const POINT_COUNT = getRandomNumber(0);

export default class PointModel extends Observable{
  #points = Array.from({ length: POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1){
      throw new Error('Can\t update unsexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(update) {
    const newPoints = this.#points.filter((point) => point.id !== update.id);
    const isLastPoint = newPoints.length === 0;

    this.#points = newPoints;
    this._notify(
      isLastPoint ? UpdateType.MAJOR : UpdateType.MINOR,
    );
  }
}

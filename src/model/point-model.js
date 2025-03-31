import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointModel extends Observable{
  #api = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointApiService) {
    super();
    this.#api = pointApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const [points, offers, destinations] = await Promise.all([
        this.#api.pointApiService.points,
        this.#api.pointApiService.offers,
        this.#api.pointApiService.destinations
      ]);

      this.#points = points.map((point) => this.#adaptToClient(point));
      this.#offers = offers;
      this.#destinations = destinations;
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1){
      throw new Error('Can\t update unsexisting task');
    }

    try {
      const response = await this.#api.pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    }catch(err) {
      throw new Error('Can\'t update task');
    }
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

  #adaptToClient(point) {
    console.log(point);

    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}

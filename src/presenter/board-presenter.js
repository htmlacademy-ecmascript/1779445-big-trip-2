import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import ContentList from '../view/content-list.js';
import { render, RenderPosition } from '../framework/render.js';

const { AFTERBEGIN, BEFOREEND } = RenderPosition;

export default class BoardPresenter {
  #headerElement = null;
  #mainElement = null;
  #contorlsElement = null;
  #pointModel = null;
  #points = [];

  #taskListcomponent = new ContentList();

  constructor({headerElement, mainElement, contorlsElement, pointModel}){
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#contorlsElement = contorlsElement;
    this.#pointModel = pointModel;
  }

  init() {
    this.#points = [...this.#pointModel.points];

    render(new TripInfoView(), this.#headerElement, AFTERBEGIN);
    render(new FilterView(), this.#contorlsElement, BEFOREEND);

    render(new SortView(), this.#mainElement, BEFOREEND);

    // Создаем экземпляр ContentList (контейнер для списка точек маршрута) и отрисовываем его
    render(this.#taskListcomponent, this.#mainElement, BEFOREEND);

    // Цикл для создания и отрисовки трех точек маршрута внутри контейнера списка
    for(let i = 0; i < this.#points.length; i++){
      // Создаем экземпляр PointView (точка маршрута) и отрисовываем его
      this.#renderPoint(this.#points[i]);
    }
    render(new EditFormView({point: this.#points[0]}), this.#taskListcomponent.element, AFTERBEGIN);
  }

  #renderPoint(point) {
    const renderComponent = new PointView({point});
    render(renderComponent, this.#taskListcomponent.element, BEFOREEND);
  }
}

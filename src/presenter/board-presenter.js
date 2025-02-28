import { render, replace, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import ContentList from '../view/content-list.js';


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
  }

  #renderPoint(point) {

    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const rollUpHandler = (evt) => {
      if(evt.target.classList.contains('event__rollup-btn')){
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
        document.removeEventListener('click', rollUpHandler);
      }
    };

    const pointEditComponent = new PointEditView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointComponent = new PointView({
      point,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown',escKeyDownHandler);

        const rollUpButton = pointEditComponent.element.querySelector('.event__rollup-btn');
        rollUpButton.addEventListener('click', rollUpHandler);
      }
    });

    function replaceCardToForm(){
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard(){
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#taskListcomponent.element, BEFOREEND);
  }
}

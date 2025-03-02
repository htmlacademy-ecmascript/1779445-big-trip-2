import { render, replace, RenderPosition } from '../framework/render.js';
import { changeFilters } from '../utils.js/filter.js';
import { changeSortType } from '../utils.js/sort.js';
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

    changeSortType(this.#points, 'day');

    this.#initializeFilters();
    this.#initializeSorts();
    this.#renderPoints(this.#points);
  }

  #initializeFilters() {
    const filteList = document.querySelector('.trip-filters');


    filteList.addEventListener('click', (evt) => {
      if (evt.target.tagName === 'INPUT') {

        const filteredPoints = changeFilters(this.#points, evt.target.value);
        this.#renderPoints(filteredPoints);
      }
    });
  }

  #initializeSorts() {
    const filteList = document.querySelector('.trip-sort');

    filteList.addEventListener('click', (evt) => {
      if (evt.target.tagName === 'INPUT') {
        const sortedPoints = changeSortType(this.#points, evt.target.value);
        this.#renderPoints(sortedPoints);
      }
    });
  }

  #renderPoints(points) {
    // Очищаем текущий список точек
    this.#taskListcomponent.element.innerHTML = '';

    // Отрисовываем новые точки
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const pointEditComponent = new PointEditView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const rollUpButton = pointEditComponent.element.querySelector('.event__rollup-btn');
    const pointComponent = new PointView({
      point,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown',escKeyDownHandler);

        rollUpButton.addEventListener('click', rollUpHandler);
      }
    });

    function escKeyDownHandler(evt) {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    function rollUpHandler(evt) {
      if(evt.target.classList.contains('event__rollup-btn')){
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
        rollUpButton.removeEventListener('click', rollUpHandler);
      }
    }

    function replaceCardToForm(){
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard(){
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#taskListcomponent.element, BEFOREEND);
  }
}

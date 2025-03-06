import { render, RenderPosition } from '../framework/render.js';
import { changeFilters } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';


const { AFTERBEGIN, BEFOREEND } = RenderPosition;
export default class BoardPresenter {
  #headerElement = null;
  #mainElement = null;
  #contorlsElement = null;
  #pointModel = null;
  #filterType = null;
  #sortType = null;
  #boardPoints = [];
  #pointPresenters = new Map();

  #pointListComponent = new PointListView();
  #sortComponent = new SortView();
  #tripInfoComponent = new TripInfoView();
  #filterComponent = new FilterView();

  constructor({headerElement, mainElement, contorlsElement, pointModel}){
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#contorlsElement = contorlsElement;
    this.#pointModel = pointModel;
  }

  init() {

    this.#boardPoints = [...this.#pointModel.points];

    this.#renderTripInfo();
    this.#renderFilter();
    this.#renderSort();
    this.#renderPointList();

    this.#initializeSorts();
    this.#initializeFilters();
    this.#renderAllPoints(this.#boardPoints);
    this.#hadleModeChange();
  }

  #renderPointList(){
    render(this.#pointListComponent, this.#mainElement, BEFOREEND);
  }

  #renderFilter(){
    render(this.#filterComponent, this.#contorlsElement, BEFOREEND);
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#headerElement, AFTERBEGIN);
  }

  #hadleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handlePointChange = (updatePoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #renderSort(){
    changeSortType(this.#boardPoints);
    render(this.#sortComponent, this.#mainElement, BEFOREEND);
  }

  #initializeFilters() {
    this.#initializeEventListeners('.trip-filters', 'filter', changeFilters, (type) => {
      this.#filterType = type;
    });
  }

  #initializeSorts() {
    this.#initializeEventListeners('.trip-sort', 'sort', changeSortType, (type) => {
      this.#sortType = type;
    });
  }

  #initializeEventListeners(selector, type, changeFunction, setTypeCallback) {
    const element = document.querySelector(selector);

    element.addEventListener('click', (evt) => {
      if (evt.target.tagName === 'INPUT') {
        const newType = evt.target.value;
        setTypeCallback(newType);

        const changedArray = changeFunction(this.#boardPoints, newType);
        const sortedAndFilteredArray = type === 'filter'
          ? changeSortType(changedArray, this.#sortType)
          : changeFilters(changedArray, this.#filterType);

        this.#renderAllPoints(sortedAndFilteredArray);
      }
    });
  }

  #renderAllPoints(points) {
    this.#pointListComponent.element.innerHTML = '';

    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#hadleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}

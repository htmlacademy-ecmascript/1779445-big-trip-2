import { render, RenderPosition, remove } from '../framework/render.js';
import { FilterType, TripSort } from '../const.js';
import { changeFilters } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import NoPointsView from '../view/no-points-view.js';

const { AFTERBEGIN, BEFOREEND } = RenderPosition;
export default class BoardPresenter {
  #headerElement = null;
  #mainElement = null;
  #contorlsElement = null;
  #pointModel = null;
  #filterType = FilterType.EVERYTHING;
  #sortType = TripSort.DAY;
  #sortComponent = null;
  #filterComponent = null;
  #sortedAndFilteredPoints = [];
  #boardPoints = [];
  #pointPresenters = new Map();
  #pointListComponent = new PointListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = null;

  constructor({headerElement, mainElement, contorlsElement, pointModel}){
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#contorlsElement = contorlsElement;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#sortedAndFilteredPoints = [...changeSortType(this.#boardPoints)];
    this.#renderTripInfo();
    this.#renderAllPoints(this.#sortedAndFilteredPoints);
    this.#renderSort();
    this.#renderFilter();
    this.#renderPointList();
    this.#hadleModeChange();
  }

  #renderPointList(){
    render(this.#pointListComponent, this.#mainElement, BEFOREEND);
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

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#mainElement, BEFOREEND);
  }

  #renderFilter(){
    this.#filterComponent = new FilterView({
      points: this.#sortedAndFilteredPoints,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });
    render(this.#filterComponent, this.#contorlsElement, BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortType = sortType;
    this.#sortedAndFilteredPoints = changeSortType(this.#sortedAndFilteredPoints, this.#sortType);
    this.#renderAllPoints(this.#sortedAndFilteredPoints);
  };

  #handleFilterTypeChange = (filterType) => {
    this.#filterType = filterType;
    this.#sortedAndFilteredPoints = changeFilters(this.#boardPoints, this.#filterType);
    this.#renderAllPoints(this.#sortedAndFilteredPoints, filterType);
  };

  #renderAllPoints(points, filterType) {
    this.#pointListComponent.element.innerHTML = '';

    if(points.length === 0){
      this.#noPointsComponent = new NoPointsView({filterType});
      render(this.#noPointsComponent, this.#mainElement, BEFOREEND);
    } else {
      remove(this.#noPointsComponent);
      for (let i = 0; i < points.length; i++) {
        this.#renderPoint(points[i]);
      }
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
}

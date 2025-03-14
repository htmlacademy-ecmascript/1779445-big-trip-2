import { render, RenderPosition, remove } from '../framework/render.js';
import { FilterType, TripSort } from '../const.js';
import { filterByTimePeriod } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import NoPointsView from '../view/no-points-view.js';

const { AFTERBEGIN, BEFOREEND, AFTEREND } = RenderPosition;

export default class BoardPresenter {
  #headerElement = null;
  #mainElement = null;
  #contorlsElement = null;
  #pointModel = null;
  #filterType = FilterType.EVERYTHING;
  #sortType = TripSort.DAY;
  #sortComponent = null;
  #filterComponent = null;
  #boardPoints = [];
  #pointPresenters = new Map();
  #pointListComponent = new PointListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = null;
  constructor({ headerElement, mainElement, contorlsElement, pointModel }) {
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#contorlsElement = contorlsElement;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];

    if(this.#boardPoints.length === 0){
      this.#renderNoPointsComponent();
      this.#renderSort('allDisabled');
    } else{
      this.#renderSort();
    }

    this.#renderTripInfo();
    this.#renderAllPoints();
    this.#renderFilter();

    this.#renderPointList();
    this.#hadleModeChange();
  }

  get #sortedAndFilteredPoints() {
    const filtered = filterByTimePeriod([...this.#boardPoints], this.#filterType);
    return changeSortType(filtered, this.#sortType);
  }

  #renderNoPointsComponent = () => {
    this.#noPointsComponent = new NoPointsView({
      filter:  this.#filterType,
    });
    render(this.#noPointsComponent, this.#mainElement, AFTEREND);
  };

  #renderPointList() {
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

  #renderFilter() {
    this.#filterComponent = new FilterView({
      points: this.#sortedAndFilteredPoints,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });
    render(this.#filterComponent, this.#contorlsElement, BEFOREEND);
  }

  #renderSort(all) {
    this.#sortComponent = new SortView({
      all: all,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#mainElement, BEFOREEND);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterType = filterType;
    this.#renderAllPoints();
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortType = sortType;
    this.#renderAllPoints();
  };

  #renderAllPoints() {
    this.#pointListComponent.element.innerHTML = '';
    const points = this.#sortedAndFilteredPoints; // Используем геттер

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
}

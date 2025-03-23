import { render, RenderPosition } from '../framework/render.js';
import { FilterType, TripSort, UpdateType, UserAction } from '../const.js';
import { filterByTimePeriod } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
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
    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get tasks() {
    this.#sortedAndFilteredPoints();
    return this.#pointModel.points;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#renderPointsOrEmptyView();
    this.#renderFilter();
  }

  get #sortedAndFilteredPoints() {
    const filtered = filterByTimePeriod([...this.#boardPoints], this.#filterType);
    return changeSortType(filtered, this.#sortType);
  }

  #renderPointsOrEmptyView() {
    if(this.#boardPoints.length === 0){
      this.#renderNoPointsComponent();
      this.#renderSort('allDisabled');
    } else{
      this.#renderSort();
      this.#renderTripInfo();
      this.#renderPointList();
      this.#renderAllPoints();
      this.#hadleModeChange();
    }
  }

  #renderNoPointsComponent = () => {
    this.#noPointsComponent = new NoPointsView({
      filter:  this.#filterType,
    });
    render(this.#noPointsComponent, this.#mainElement, AFTEREND);
  };

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#headerElement, AFTERBEGIN);
  }

  #hadleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_TASK:
        this.#pointModel.addTask(updateType, update);
        break;

      case UserAction.DELETE_TASK:
        this.#pointModel.deleteTask(UpdateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      // Локально обновить одну точку (если изменились незначительные данные).
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      // Перерисовать весь список (если изменения затрагивают порядок или фильтрацию).
      case UpdateType.MINOR:
        this.#clearTaskList();
        this.#renderAllPoints();
        break;
      // Полностью пересоздать интерфейс (если произошли критические изменения, например, загрузка новых данных с сервера).
      case UpdateType.MAJOR:
        this.#boardPoints = [...this.#pointModel.points];
        this.#clearTaskList();
        this.#renderPointsOrEmptyView();
        break;
    }
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
    if(this.#sortType === sortType){
      return;
    }
    this.#sortType = sortType;
    this.#renderAllPoints();
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#hadleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderAllPoints() {
    this.#clearTaskList();
    this.#pointListComponent.element.innerHTML = '';
    const points = this.#sortedAndFilteredPoints;
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#mainElement, BEFOREEND);
  }

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}

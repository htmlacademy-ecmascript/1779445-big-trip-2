import { render, RenderPosition, remove} from '../framework/render.js';
import { TripSort, UpdateType, UserAction } from '../const.js';
import { filterByTimePeriod, FILTERS } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import NoPointsView from '../view/no-points-view.js';
import NewPointPresenter from './new-points-presenter.js';

const { AFTERBEGIN, BEFOREEND, AFTEREND } = RenderPosition;

export default class BoardPresenter {
  #headerElement = null;
  #mainElement = null;
  #pointModel = null;
  #filterType = FILTERS.everything.type;
  #sortType = TripSort.DAY;
  #sortComponent = null;
  #boardPoints = [];
  #pointPresenters = new Map();
  #pointListComponent = new PointListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = null;
  #filterModel = null;
  #newPointPresenter = null;

  constructor({ headerElement, mainElement, pointsModel, filterModel, onNewPointDestroy }) {
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#pointModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const allPoints = this.#pointModel.points;
    const filtered = filterByTimePeriod(allPoints, this.#filterModel.filter);
    return changeSortType(filtered.points || [], this.#sortType);
  }

  createPoint() {
    this.currentSortType = TripSort.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTERS.everything.type);
    this.#newPointPresenter.init();
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#renderPointsOrEmptyView();
  }

  #renderPointsOrEmptyView() {
    if(this.#boardPoints.length === 0){
      this.#renderNoPointsComponent();
      this.#renderSort('allDisabled');
    } else {
      this.#renderSort();
      this.#renderTripInfo();
      this.#handleModeChange();
      this.#renderPointList();
      this.#renderAllPoints();
    }
  }

  #renderNoPointsComponent = () => {
    this.#noPointsComponent = new NoPointsView({
      filter:  this.#filterType,
    });
    render(this.#noPointsComponent, this.#mainElement, AFTEREND);
  };

  #renderTripInfo() {
    remove(this.#tripInfoComponent);
    this.#tripInfoComponent = new TripInfoView();
    render(this.#tripInfoComponent, this.#headerElement, AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_TASK:
        this.#pointModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_TASK:
        this.#pointModel.deletePoint(updateType, update);
        this.#boardPoints = [...this.#pointModel.points];
        break;
    }
  };

  #renderSort(all) {
    this.#sortComponent = new SortView({
      all: all,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#mainElement, AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#sortType === sortType){
      return;
    }
    this.#sortType = sortType;
    this.#renderAllPoints();
  };


  #handleModelEvent = (updateType, data) => {
    if (data?.isFilterChange) {
      this.#sortType = TripSort.DAY;
      this.#clearTaskList();
      remove(this.#sortComponent);
      this.#sortComponent.element.innerHTML = '';
      this.#renderSort();
      this.#renderAllPoints();
      return;
    }

    switch (updateType) {
      // Локально обновить одну точку (если изменились незначительные данные).
      case UpdateType.PATCH:
        this.#boardPoints = this.points.map((point) => point.id === data.id ? data : point);
        this.#pointPresenters.get(data.id).init(data);
        break;
      // Перерисовать весь список (если изменения затрагивают порядок или фильтрацию).
      case UpdateType.MINOR:
        this.#boardPoints = this.points;
        this.#clearTaskList();
        this.#clearBoard();
        this.#renderPointsOrEmptyView();
        break;
      // Полностью пересоздать интерфейс (если произошли критические изменения, например, загрузка новых данных с сервера).
      case UpdateType.MAJOR:
        this.#boardPoints = this.points;
        this.#clearTaskList();
        this.#clearBoard();
        this.#renderPointsOrEmptyView();
        break;
    }
  };

  #clearBoard(){
    remove(this.#noPointsComponent);
    remove(this.#sortComponent);
    remove(this.#tripInfoComponent);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderAllPoints() {
    this.#clearTaskList();
    this.#pointListComponent.element.innerHTML = '';
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#mainElement, BEFOREEND);
  }

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}

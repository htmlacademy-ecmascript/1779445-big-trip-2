import { render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { TripSort, UpdateType, UserAction } from '../const.js';
import { filterByTimePeriod, FILTERS } from '../utils/filter.js';
import { changeSortType } from '../utils/sort.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import NoPointsView from '../view/no-points-view.js';
import NewPointPresenter from './new-points-presenter.js';
import LoadingView from '../view/loading-view.js';

const { AFTERBEGIN, BEFOREEND, AFTEREND } = RenderPosition;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
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
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #noPointsComponent = null;
  #filterModel = null;
  #newPointPresenter = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ headerElement, mainElement, pointsModel, filterModel, onNewPointDestroy }) {
    this.#headerElement = headerElement;
    this.#mainElement = mainElement;
    this.#pointModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      pointsModel: this.#pointModel,
    });

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const allPoints = this.#pointModel.points;
    const filtered = filterByTimePeriod(allPoints, this.#filterModel.filter);
    return changeSortType(filtered.points || [], this.#sortType);
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#renderBoard();
  }

  #renderBoard() {
    if(this.#isLoading){
      this.#renderLoading();
    } else if(this.#boardPoints.length === 0){
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

  createPoint() {
    this.currentSortType = TripSort.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTERS.everything.type);
    this.#newPointPresenter.init();
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        this.#pointModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        this.#pointModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        this.#pointModel.deletePoint(updateType, update);
        this.#boardPoints = [...this.#pointModel.points];
        break;
    }
    this.#uiBlocker.unblock();
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
      this.#clearPointList();
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
        this.#pointPresenters.get(data.id).init(data, this.#pointModel.destinations, this.#pointModel.offers);
        break;
      // Перерисовать весь список (если изменения затрагивают порядок или фильтрацию).
      case UpdateType.MINOR:
        this.#boardPoints = this.points;
        this.#clearPointList();
        this.#clearBoard();
        this.#renderBoard();
        break;
      // Полностью пересоздать интерфейс (если произошли критические изменения, например, загрузка новых данных с сервера).
      case UpdateType.MAJOR:
        this.#boardPoints = this.points;
        this.#clearPointList();
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        this.#boardPoints = this.points;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#mainElement, AFTERBEGIN);
  }

  #clearBoard(){
    remove(this.#noPointsComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#tripInfoComponent);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, offers, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderAllPoints() {
    const destinations = this.#pointModel.destinations;
    const offers = this.#pointModel.offers;
    this.#clearPointList();
    this.#pointListComponent.element.innerHTML = '';
    this.points.forEach((point) => this.#renderPoint(point, destinations, offers));
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#mainElement, BEFOREEND);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}

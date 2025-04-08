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
import FailedLoadView from '../view/failed-load-data-view.js';


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
  #tripInfoComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #noPointsComponent = null;
  #filterModel = null;
  #newPointPresenter = null;
  #hasError = false;
  #failedLoadComponent = null;

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
      noPoint: () => {
        this.#renderSort('allDisabled');
        this.#renderNoPointsComponent(FILTERS.everything);
      }
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
    if (this.#hasError) {
      this.#renderFailedLoad();
      return;
    }
    if(this.#isLoading){
      this.#renderLoading();
    } else if(this.#boardPoints.length === 0 && this.#pointModel.points.length === 0){
      this.#filterType = this.#filterModel.filter;
      this.#renderSort('allDisabled');
      this.#renderNoPointsComponent(FILTERS.everything);
    }else if(this.#boardPoints.length === 0){
      this.#filterType = this.#filterModel.filter;
      this.#renderSort('allDisabled');
      this.#renderNoPointsComponent(FILTERS[this.#filterType]);
      const city = this.getDestinationTrip(this.#pointModel.points, this.#pointModel.destinations, this.#pointModel.offers);
      this.#renderTripInfo(city);
    } else {
      this.#clearBoard();
      this.#renderSort();
      this.#handleModeChange();
      this.#renderPointList();
      this.#renderAllPoints();
      const city = this.getDestinationTrip(this.#pointModel.points, this.#pointModel.destinations, this.#pointModel.offers);
      this.#renderTripInfo(city);
    }
  }

  #renderFailedLoad() {
    this.#clearBoard();
    this.#failedLoadComponent = new FailedLoadView();
    render(this.#failedLoadComponent, this.#mainElement, AFTEREND);
  }

  getDestinationTrip(points, destinations, offers) {
    const sortedPoints = [...points].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const getCityName = (point) => {
      if (!point || !point.destination) {
        return 'Unknown'; // Если destination не определен, возвращаем 'Unknown'
      }

      const dest = destinations.find((d) => d.id === point.destination);
      return dest?.name || 'Unknown';
    };

    const getDateFormat = (point, time) => {
      if(!point){
        return;
      }

      return time === 'first' ? point.dateFrom : point.dateTo;
    };

    const getSumAllTrip = () => {
      // Суммируем базовые цены
      const sumOfBasePrice = sortedPoints
        .map((item) => item.basePrice)
        .reduce((sum, value) => sum + value, 0);

      // Получаем только непустые массивы offers
      const selectedOffers = sortedPoints.flatMap((item) => item.offers);
      const allAvailbleOffers = offers.flatMap((item) => item.offers);
      const sumOfOffers = selectedOffers.reduce((sum, value) => sum + allAvailbleOffers.find((item) => item.id === value).price, 0);

      return (sumOfOffers + sumOfBasePrice);
    };

    const first = getCityName(sortedPoints[0]);
    const last = getCityName(sortedPoints[sortedPoints.length - 1]);
    const middle = sortedPoints.length > 2 ? getCityName(sortedPoints[Math.floor(sortedPoints.length / 2)]) : '';
    const firstDate = getDateFormat(sortedPoints[0], 'first');
    const lastDate = getDateFormat(sortedPoints[sortedPoints.length - 1], 'end');
    const sumTrip = getSumAllTrip();

    return {first, last, middle, poitns: sortedPoints.length, firstDate, lastDate, sumTrip};
  }

  createPoint () {
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

  #renderTripInfo(city) {
    remove(this.#tripInfoComponent);
    this.#tripInfoComponent = new TripInfoView({
      first: city.first,
      middle: city.middle,
      last: city.last,
      points: city.poitns,
      firstDate: city.firstDate,
      lastDate: city.lastDate,
      sumTrip: city.sumTrip,
    });
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
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;


      case UserAction.DELETE_POINT: {
        const presenter = this.#pointPresenters.get(update.id);
        presenter.setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
          this.#boardPoints = [...this.#pointModel.points];
          this.#pointPresenters.delete(update.id);
          presenter.destroy();
        } catch(err) {
          presenter.setAborting();
        }
        break;
      }
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
      this.#clearBoard();
      this.#clearPointList();
      this.#renderAllPoints();

      if(this.#pointModel.points.length !== 0){
        this.#renderSort();
        const city = this.getDestinationTrip(this.#pointModel.points, this.#pointModel.destinations, this.#pointModel.offers);
        this.#renderTripInfo(city);
      }
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
      case UpdateType.MAJOR:
        this.#boardPoints = this.points;
        this.#clearPointList();
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;

        // Новый код: обработка ошибки
        this.#hasError = data?.error ?? false;

        if (!this.#hasError) {
          this.#boardPoints = this.points;
        }

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

import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import ContentList from '../view/content-list.js';
import { RenderPosition } from '../render.js';
import { render } from '../render.js';


export default class BoardPresenter {
  constructor({headerContainer, mainContainer, contolsFilter: controlsFilter}){
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
    this.contolsFilter = controlsFilter;
  }

  init() {
    render(new TripInfoView(), this.headerContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.contolsFilter, RenderPosition.BEFOREEND);

    render(new SortView(), this.mainContainer, RenderPosition.BEFOREEND);

    // Создаем экземпляр ContentList (контейнер для списка точек маршрута) и отрисовываем его
    const contentList = new ContentList();
    render(contentList, this.mainContainer, RenderPosition.BEFOREEND);

    // Цикл для создания и отрисовки трех точек маршрута внутри контейнера списка
    for(let i = 0; i < 3; i++){
      // Создаем экземпляр PointView (точка маршрута) и отрисовываем его
      render(new PointView(), contentList.getElement(), RenderPosition.BEFOREEND);
    }

    render(new EditFormView(), contentList.getElement(), RenderPosition.AFTERBEGIN);
  }
}

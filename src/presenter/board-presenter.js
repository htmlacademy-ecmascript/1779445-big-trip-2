import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import ContentList from '../view/content-list.js';
import { RenderPosition } from '../render.js';
import { render } from '../render.js';


export default class BoardPresenter {
  constructor({headerElement, mainElement, contorlsElement, pointModel}){
    this.headerElement = headerElement;
    this.mainElement = mainElement;
    this.contorlsElement = contorlsElement;
    this.pointModel = pointModel;
  }

  init() {
    this.pointModel = [...this.pointModel.getPoint()];

    render(new TripInfoView(), this.headerElement, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.contorlsElement, RenderPosition.BEFOREEND);

    render(new SortView(), this.mainElement, RenderPosition.BEFOREEND);

    // Создаем экземпляр ContentList (контейнер для списка точек маршрута) и отрисовываем его
    const contentList = new ContentList();
    render(contentList, this.mainElement, RenderPosition.BEFOREEND);

    // Цикл для создания и отрисовки трех точек маршрута внутри контейнера списка
    for(let i = 0; i < this.pointModel.length; i++){
      // Создаем экземпляр PointView (точка маршрута) и отрисовываем его
      render(new PointView({point: this.pointModel[i]}), contentList.getElement(), RenderPosition.BEFOREEND);
    }

    render(new EditFormView({point: this.pointModel[0]}), contentList.getElement(), RenderPosition.AFTERBEGIN);
  }
}

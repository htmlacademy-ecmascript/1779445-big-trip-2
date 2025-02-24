import BoardPresenter from '../src/presenter/board-presenter.js';
import PointModel from '../src/model/point-model.js';

const headerElement = document.querySelector('.trip-main');
const mainElement = document.querySelector('.trip-events');
const contorlsElement = headerElement.querySelector('.trip-controls__filters');
const pointModel = new PointModel();

const boardPresenter = new BoardPresenter(
  {
    headerElement,
    mainElement,
    contorlsElement,
    pointModel,
  }
);

boardPresenter.init();

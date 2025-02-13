import BoardPresenter from '../src/presenter/board-presenter.js';


const headerElement = document.querySelector('.trip-main');
const mainElement = document.querySelector('.trip-events');
const contorlsElement = headerElement.querySelector('.trip-controls__filters');

const boardPresenter = new BoardPresenter(
  {
    headerContainer: headerElement,
    mainContainer: mainElement,
    contolsFilter: contorlsElement
  }
);

boardPresenter.init();

import AbstractView from '../framework/view/abstract-view';
import { FilterEmptyPoints } from '../const';

function createNoPointsViewTemplate(filter) {
  return (`<p class="trip-events__msg">${FilterEmptyPoints[filter.filter.toUpperCase()]}</p>`);
}

export default class NoPointsView extends AbstractView {
  #filterValue = null;

  constructor(filterType){
    super();
    this.#filterValue = filterType;
  }

  get template() {
    return createNoPointsViewTemplate(this.#filterValue);
  }
}

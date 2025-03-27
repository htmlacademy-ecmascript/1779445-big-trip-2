import Observable from '../framework/observable';
import { FILTERS } from '../utils/filter';

export default class FilterModel extends Observable {
  #filter = FILTERS.everything.type;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, {
      filter: this.#filter,
      isFilterChange: true,
    });
  }
}


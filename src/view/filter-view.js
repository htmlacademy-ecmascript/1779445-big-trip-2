import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';
import { checkDisabled } from '../utils/filter.js';

function createFilterTemplate(filterPoints) {

  function checkDisabledFilter(item){
    const array = checkDisabled(filterPoints);
    for (const key in array) {
      if(key === item && array[key] === false){
        return 'disabled';
      }
    }
  }

  function getFilterElement() {
    const values = Object.values(FilterType);

    return values.map((item) =>
      `<div class="trip-filters__filter">
        <input id="filter-${item}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${item}"
        ${item === 'everything' ? 'checked' : ''}
        ${checkDisabledFilter(item)}>
        <label class="trip-filters__filter-label" for="filter-${item}" data-filter-type="${item}">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
      </div>`).join('');
  }

  return (
    `<form class="trip-filters" action="#" method="get">
        ${getFilterElement()}
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView{
  #handleFilterTypeChange = null;
  #filterPoints = null;

  constructor({ onFilterTypeChange, points}){
    super();
    this.#filterPoints = points;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('click', (evt) => this.#filterTypeChangeHandler(evt));
  }

  get template() {
    return createFilterTemplate(this.#filterPoints);
  }

  #filterTypeChangeHandler(evt) {
    const element = evt.target.parentElement.querySelector('.trip-filters__filter-input');
    element.checked = true;
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  }
}

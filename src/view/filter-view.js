import AbstractView from '../framework/view/abstract-view.js';
import { FILTERS } from '../utils/filter.js';

function createFilterTemplate(filterPoints, currentFilter) {

  function getEmptyFilter(item) {
    const filterElement = filterPoints.find((filter) => filter.type === item);
    return filterElement ? filterElement.points.length === 0 : true;
  }

  function getFilterElement() {
    const filterTypeValues = Object.values(FILTERS);

    return filterTypeValues.map((item) =>
      `<div class="trip-filters__filter">
        <input id="filter-${item.type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${item.type}"
          ${item.type === currentFilter ? 'checked' : ''}
          ${getEmptyFilter(item.type) ? 'disabled' : ''}
        >
        <label class="trip-filters__filter-label"  for="filter-${item.type}" data-filter-type="${item.type}">
          ${item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}
        </label>
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
  #currentFilter = null;

  constructor({ filters, onFilterTypeChange, currentFilterType }){
    super();
    this.#filterPoints = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.#currentFilter = currentFilterType;
    this.element.addEventListener('click', (evt) => this.#filterTypeChangeHandler(evt));
  }

  get template() {
    return createFilterTemplate(this.#filterPoints, this.#currentFilter);
  }

  #filterTypeChangeHandler(evt) {
    const filterElement = evt.target.parentElement.querySelector('.trip-filters__filter-input');

    if (filterElement.disabled || evt.target.tagName !== 'LABEL') {
      return;
    }
    filterElement.checked = true;
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  }
}

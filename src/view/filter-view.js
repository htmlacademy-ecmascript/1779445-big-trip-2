import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function createFilterTemplate() {

  function getFilterElement() {
    const values = Object.values(FilterType);

    return values.map((item) =>
      `<div class="trip-filters__filter">
        <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" ${item === 'everything' ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${item}">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
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
  get template() {
    return createFilterTemplate();
  }
}

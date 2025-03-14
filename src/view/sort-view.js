import AbstractView from '../framework/view/abstract-view.js';
import { TripSort } from '../const.js';

function createSortTemplate(all){

  function getDisabled(item) {
    if(all === 'allDisabled' || item === 'event' || item === 'offers'){
      return 'disabled';
    } else{
      return '';
    }
  }
  function getSortElement() {
    const values = Object.values(TripSort);

    return values.map((item) => {
      item = item.replace('sort-', '');

      return `<div class="trip-sort__item  trip-sort__item--${item}">
        <input
          id="sort-${item}"
          class="trip-sort__input visually-hidden"
          type="radio" name="trip-sort"
          value="sort-${item}"
          ${getDisabled(item)}
          ${item === 'day' ? 'checked' : ''}
        >
        <label class="trip-sort__btn" for="sort-${item}" data-sort-type="sort-${item}">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
     </div>`;
    }).join('');

  }

  return (
    ` <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${getSortElement()}
      </form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #all = null;
  constructor({ all, onSortTypeChange }){
    super();
    this.#all = all;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', (evt) => this.#sortTypeChangeHandler(evt));
  }

  get template() {
    return createSortTemplate(this.#all);
  }

  #sortTypeChangeHandler(evt) {
    if(
      this.all === 'allDisabled'
      || evt.target.dataset.sortType === 'sort-event'
      || evt.target.dataset.sortType === 'sort-offers'
    ) {
      return;
    }
    const element = evt.target.parentElement.querySelector('.trip-sort__input');
    element.checked = true;
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  }
}

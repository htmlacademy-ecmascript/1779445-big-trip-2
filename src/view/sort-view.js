import AbstractView from '../framework/view/abstract-view.js';
import { TripSort } from '../const.js';

function createSortTemplate(){

  function getSortElement() {
    const values = Object.values(TripSort);

    return values.map((item) => {
      item = item.replace('sort-', '');

      return `<div class="trip-sort__item  trip-sort__item--${item}">
        <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${item === 'event' || item === 'offers' ? 'disabled' : ''} ${item === 'day' ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${item}">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
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
  get template() {
    return createSortTemplate();
  }
}

import AbstractView from '../framework/view/abstract-view.js';
import { TripSort } from '../const.js';

function createSortTemplate(){

  function getSortElement() {
    const values = Object.values(TripSort);

    return values.map((item) =>
      `<div class="trip-sort__item  trip-sort__item--${item}">
        <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}">
        <label class="trip-sort__btn" for="sort-${item}">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
     </div>`).join('');
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

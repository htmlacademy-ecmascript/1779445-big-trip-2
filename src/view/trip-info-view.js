import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function createInfoTemplate(first, middle, last, points, firstDate, lastDate, sumTrip){

  function getcityTemplate() {
    if(points === 1){
      return `<h1 class="trip-info__title">${first}</h1>`;
    } else if (points === 2){
      return ` <h1 class="trip-info__title">${first} &mdash; ${last}</h1>`;
    } else if (points === 3) {
      return `<h1 class="trip-info__title">${first} &mdash; ${middle} &mdash; ${last}</h1>`;
    } else if (points > 3) {
      return `<h1 class="trip-info__title">${first} &mdash; ... &mdash; ${last}</h1>`;
    } else {
      return '<h1 class="trip-info__title"> Choose yore city </h1>';
    }
  }


  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getcityTemplate()}</h1>
        <p class="trip-info__dates">${dayjs(firstDate).format('D MMM')}&nbsp;&mdash;&nbsp;${dayjs(lastDate).format('D MMM')}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${sumTrip}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView{
  #first = null;
  #middle = null;
  #last = null;
  #points = null;
  #firstDate = null;
  #lastDate = null;
  #sumTrip = null;

  constructor({first, middle, last, points, firstDate, lastDate, sumTrip}) {
    super();
    this.#first = first;
    this.#middle = middle;
    this.#last = last;
    this.#points = points;
    this.#firstDate = firstDate;
    this.#lastDate = lastDate;
    this.#sumTrip = sumTrip;
  }

  get template() {
    return createInfoTemplate(this.#first, this.#middle, this.#last, this.#points, this.#firstDate, this.#lastDate, this.#sumTrip);
  }
}

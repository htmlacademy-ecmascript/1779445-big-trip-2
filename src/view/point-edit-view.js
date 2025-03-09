import AbstractView from '../framework/view/abstract-view.js';
import { getDateFormat, getRandomNumber } from '../utils/common.js';
import { DATE_FORMAT_TIME_EDITFORM } from '../const.js';
import { EventType } from '../const.js';

function createEditFormTemplate(point){

  const { dateFrom, dateTo, destination, offers, type} = point;
  const dateFormattedStart = getDateFormat(dateFrom, DATE_FORMAT_TIME_EDITFORM);
  const dateFormattedEnd = getDateFormat(dateTo, DATE_FORMAT_TIME_EDITFORM);

  function createOffers(){
    return offers.offers.map((offersItem) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offersItem.id}" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="event-offer-luggage-${offersItem.id}">
            <span class="event__offer-title">${offersItem.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offersItem.price}</span>
          </label>
        </div>`).join('');
  }

  function createPhotoArray(){

    const photos = Array.from({ length: getRandomNumber(5) }, () => `<img class="event__photo" src="https://loremflickr.com/248/152?random=${getRandomNumber()}.jpg" alt="Event photo">`);
    return photos;
  }

  function getEventElement() {
    const values = Object.values(EventType);
    return values.map((item) =>
      `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${item.slice(0, 1).toUpperCase() + item.slice(1)}</label>
      </div>`).join('');
  }

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${getEventElement()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFormattedStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateFormattedEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffers()}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.name} that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
               ${createPhotoArray()}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class PointEditView extends AbstractView {
  #point = null;
  #handleFormSubmit = null;

  constructor({ point, onFormSubmit }){
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formSubmitHandler);
  }

  get template() {
    return createEditFormTemplate(this.#point);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };
}

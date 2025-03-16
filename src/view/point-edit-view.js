import AbstractView from '../framework/view/abstract-view.js';
import { getDateFormat, getRandomNumber } from '../utils/common.js';
import { DATE_FORMAT_TIME_EDITFORM } from '../const.js';
import { EventType, DestinationType } from '../const.js';

// Возвращаем template для выбора типа маршрута
function createEventTypeButtonTemplate(point, type) {
  const value = Object.values(EventType);
  function getDesitinationLabel() {
    return value.map((item) =>
      `<div class="event__type-item">
        <input id="event-type-${item}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-${point.id}">
          ${item.slice(0, 1).toUpperCase() + item.slice(1)}
        </label>
      </div>`).join('');
  }

  return (
    `<label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
      <span class="visually-hidden">
        Choose event type
      </span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">
          Event type
        </legend>
        ${getDesitinationLabel()}
      </fieldset>
    </div>`
  );
}

// Получаем и возвращаем template для выбора города
function createDestinationTemplate(point, type, destination) {
  const value = Object.values(DestinationType);
  function getDestinationCity() {
    return value.map((item) =>
      `<option value="${item}"></option>`
    );
  }
  return(
    `<label class="event__label  event__type-output" for="event-destination-${point.id}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${point.id}">
    <datalist id="destination-list-${point.id}">
      ${getDestinationCity()}
    </datalist>`
  );
}

// Получаем и возвращаем template для выбора даты
function createDateFromToTemplate(dateFrom, dateTo, point) {
  return(
    `<label class="visually-hidden" for="event-start-time-${point.id}">
      From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${dateFrom}">
      &mdash;
    <label class="visually-hidden" for="event-end-time-${point.id}">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${dateTo}">`
  );
}

// Получаем и возвращаем template для офферов
function createOffersTemplate(offers){
  return offers.offers.map((offersItem) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offersItem.id}" type="checkbox" name="event-offer-luggage">
      <label class="event__offer-label" for="event-offer-luggage-${offersItem.id}">
        <span class="event__offer-title">
          ${offersItem.title}
        </span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">
          ${offersItem.price}
        </span>
      </label>
    </div>`).join('');
}

// Получаем и возвращаем template для фотографий
function createPhotoTemplate(){
  const photos = Array.from(
    { length: getRandomNumber(5) },
    () => `<img class="event__photo" src="https://loremflickr.com/248/152?random=${getRandomNumber()}.jpg" alt="Event photo">`
  );

  return photos;
}

function createEditFormTemplate(point){

  const { dateFrom, dateTo, destination, offers, type} = point;
  const dateFormattedStart = getDateFormat(dateFrom, DATE_FORMAT_TIME_EDITFORM);
  const dateFormattedEnd = getDateFormat(dateTo, DATE_FORMAT_TIME_EDITFORM);

  // возвращем template формы редактирования
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            ${createEventTypeButtonTemplate(point, type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            ${createDestinationTemplate(point, type, destination)}
          </div>

          <div class="event__field-group  event__field-group--time">
            ${createDateFromToTemplate(dateFormattedStart, dateFormattedEnd, point)}
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${point.id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">
              Open event
            </span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">
              Offers
            </h3>
            <div class="event__available-offers">
              ${createOffersTemplate(offers)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">
              Destination
            </h3>
            <p class="event__destination-description">
              ${destination.name} that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.
            </p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
               ${createPhotoTemplate()}
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

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateFormat, getRandomNumber } from '../utils/common.js';
import { DATE_FORMAT_TIME_EDITFORM } from '../const.js';
import { EventType, DestinationType } from '../const.js';
import { mockOffers } from '../mock/offers.js';
import { mockDestination } from '../mock/destination.js';

// Возвращаем template для выбора типа маршрута
function createEventTypeButtonTemplate(point, type) {
  const value = Object.values(EventType);

  function getTypeOfEvent() {
    return value.map((item) =>
      `<div class="event__type-item">
        <input id="event-type-${item}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-${point.id}">
          ${item.slice(0, 1).toUpperCase() + item.slice(1)}
        </label>
      </div>`).join('');
  }

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
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
          ${getTypeOfEvent()}
        </fieldset>
      </div>
    </div>`
  );
}

// Получаем и возвращаем template для выбора города
function createDestinationTemplate(point, type, destination) {

  const value = Object.values(DestinationType);

  function getDestinationCity() {
    return value.map((item) => `<option value='${item}'></option>`).join('');
  }
  return(
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${point.id}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${point.id}">
      <datalist id="destination-list-${point.id}">
        ${getDestinationCity()}
      </datalist>
    </div>`
  );
}

// Получаем и возвращаем template для выбора даты
function createDateFromToTemplate(dateFrom, dateTo, point) {
  return(
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${point.id}">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${dateFrom}">
        &mdash;
      <label class="visually-hidden" for="event-end-time-${point.id}">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${dateTo}">
    </div>`
  );
}

// Получаем и возвращаем template для выбора цены
function createPriceTemplate(point) {

  return(
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${point.id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.basePrice}">
    </div>`
  );
}

// Получаем и возвращаем template для офферов
function createOffersTemplate(offers){
  return offers.offersArray.map((offersItem) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-${offersItem.id}" type="checkbox" name="event-offer-luggage" ${offersItem.checked ? 'checked' : ''}>
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
    () => `<img class="event__photo" src="img/photos/${getRandomNumber(5)}.jpg" alt="Event photo">`
  );

  return photos;
}

function createEditFormTemplate(point){

  const { dateFrom, dateTo, destination, offers, type } = point;
  const dateFormattedStart = getDateFormat(dateFrom, DATE_FORMAT_TIME_EDITFORM);
  const dateFormattedEnd = getDateFormat(dateTo, DATE_FORMAT_TIME_EDITFORM);

  // возвращем template формы редактирования
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createEventTypeButtonTemplate(point, type)}
          ${createDestinationTemplate(point, type, destination)}
          ${createDateFromToTemplate(dateFormattedStart, dateFormattedEnd, point)}
          ${createPriceTemplate(point)}
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
              ${destination.description}
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

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;

  constructor({ point, onFormSubmit }){
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state);
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers(){
    this.element.querySelector('form').addEventListener('submit', this.#handleFormSumbmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleFormSumbmit);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((offer) => {
      offer.addEventListener('click', this.#offerChangeHandler);
    });

  }

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.id.slice(20);

    this.updateElement({
      ...this._state,
      offers: {
        ...this._state.offers,
        offersArray: this._state.offers.offersArray.map((offer) =>
          offerId === offer.id ? { ...offer, checked: !offer.checked } : offer)
      },
    });
  };

  #handleFormSumbmit = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStatetpPoint(this._state));
  };

  #findOffers = (evt) => mockOffers.find((item) => item.type === evt.target.value);
  #findDestination = (evt) => mockDestination.find((item) => item.name === evt.target.value);

  #priceChangeHandler = (evt) => {
    this.updateElement({...this._state, basePrice: evt.target.value});
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({...this._state, type: evt.target.value, offers: this.#findOffers(evt)});
  };

  #destinationChangeHandler = (evt) => {
    const destName = this.#findDestination(evt)?.name ?? this._state.destination.name;
    const destDescription = this.#findDestination(evt)?.description ?? this._state.destination.description;
    this.updateElement({...this._state, destination: { ...this._state.destination, name : destName, description: destDescription}});
  };

  static parsePointToState = (point) => ({ ...point });

  static parseStatetpPoint(state){
    const point = {...state};
    return point;
  }
}

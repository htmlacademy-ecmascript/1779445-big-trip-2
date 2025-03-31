import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateFormat, getRandomNumber } from '../utils/common.js';
import { DATE_FORMAT_TIME_EDITFORM } from '../const.js';
import { EventType } from '../const.js';
import flatpickr from 'flatpickr';
import { nanoid } from 'nanoid';
import 'flatpickr/dist/flatpickr.min.css';


const newEmptyPoint = {
  basePrice: getRandomNumber(),
  dateFrom: '2019-07-11T00:00:00Z',
  dateTo: '2019-07-11T00:00:00Z',
  destination: {
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    id: 'TmSPuYNeOfGlG6XHWfWSU',
    name: 'Chamonix',
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=${getRandomNumber()}`,
        description: 'Geneva parliament building'
      }
    ]
  },
  id: nanoid(),
  isFavorite: false,
  offers: [],
  type: 'taxi',
};


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

  const destinationElement = destination.find((item) => item.id === point.destination);
  const allCity = destination.map((item) => item.name);

  function getDestinationCity() {
    const value = allCity.map((item) => `<option value="${item}">${item}</option>`).join('');
    return value;
  }
  return(
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${destinationElement.id}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${destinationElement.id}" type="text" name="event-destination" value="${destinationElement?.name ?? 'Choose city'}" list="destination-list-${destinationElement.id}">
      <datalist id="destination-list-${destinationElement.id}">
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
      <input class="event__input  event__input--price" id="event-price-${point.id}" type="number" name="event-price" value="${isFinite(point.basePrice) ? point.basePrice : 0}">
    </div>`
  );
}

// Получаем и возвращаем template для офферов
function createOffersTemplate(offers, point) {

  const availableOffers = offers.find((offerGroup) => offerGroup.type === point.type)?.offers || [];

  return availableOffers.map((offer) => `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer"
        data-offer-id="${offer.id}"
        ${point.offers.some((item) => item === offer.id) ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;<span>${offer.price}</span>
      </label>
    </div>
  `).join('');
}

// Получаем и возвращаем template для фотографий
function createPhotoTemplate(pictures){
  const arrayPic = pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`);
  return arrayPic;
}

function createEditFormTemplate(point, destination, offers){

  const { dateFrom, dateTo, type, isNewPoint } = point;
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
          <button class="event__reset-btn" type="reset">${isNewPoint ? 'Delete' : 'Cancel'}</button>
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
              ${createOffersTemplate(offers, point)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">
              Destination
            </h3>
            <p class="event__destination-description">
              ${destination.find((item) => item.id === point.destination).description}
            </p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
               ${createPhotoTemplate(destination.find((item) => item.id === point.destination).pictures)}
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
  #handleDeleteClick = null;
  #isNewPoint = null;
  #destination = null;
  #offers = null;

  constructor({ point, destination, offers, onFormSubmit, onDeleteClick, isNewPoint }){
    super();

    if (!point || Object.keys(point).length === 0) {
      point = { ...newEmptyPoint, isNewPoint: true };
    }

    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;
    this.#destination = destination;
    this.#offers = offers;
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destination, this.#offers);
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers(){
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((offer) => {
      offer.addEventListener('click', this.#offerChangeHandler);
    });
    this.element.querySelector('.event__field-group--time').addEventListener('click', this.#setDatePicker);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  }

  #deleteHandler = () => {
    this.#handleDeleteClick();
  };

  #dateChangeHandler = (userDate, dateType) => {
    this.updateElement({
      [dateType]: userDate.toISOString('yy/MM/dd HH:mm'),
    });
  };

  #setDatePicker = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }

    const inputElement = evt.target.closest('.event__input--time');

    const dateType = inputElement.name === 'event-start-time' ? 'dateFrom' : 'dateTo';

    if (inputElement && !inputElement.flatpickrInstance) {
      inputElement.flatpickrInstance = flatpickr(inputElement, {
        dateFormat: 'y/m/d H:i',
        enableTime: true,
        ['time_24hr']: false,
        defaultDate: this._state[dateType],
        onChange: (selectedDates) => this.#dateChangeHandler(new Date(selectedDates[0]), dateType),
      });
    }
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.dataset.offerId;
    if (!offerId) {
      return;
    }

    const currentType = this._state.type;
    const availableOffers = this.#offers
      .find((offerGroup) => offerGroup.type === currentType)?.offers || [];

    const selectedOffer = availableOffers.find((offer) => offer.id === offerId);

    if (!selectedOffer) {
      return;
    }

    const isOfferSelected = this._state.offers.some((offer) => offer === selectedOffer.id);

    const updatedOffers = isOfferSelected
      ? this._state.offers.filter((offer) => offer !== selectedOffer.id)
      : [...this._state.offers, selectedOffer.id];

    this.updateElement({
      ...this._state,
      offers: updatedOffers
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStatetpPoint(this._state));
  };

  #findDestination = (evt) => {
    const cityName = evt.target.value;
    return this.#destination.find((dest) => dest.name === cityName) || newEmptyPoint.destination;
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({ ...this._state, basePrice: evt.target.value });
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;

    this.updateElement({
      ...this._state,
      type: newType,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const newDestination = this.#findDestination(evt);
    if (!newDestination) {
      return;
    }
    this.updateElement({
      ...this._state,
      destination: newDestination.id // Сохраняем только ID
    });
  };

  static parsePointToState = (point) => ({ ...point });

  static parseStatetpPoint(state){
    const point = {...state};
    return point;
  }
}

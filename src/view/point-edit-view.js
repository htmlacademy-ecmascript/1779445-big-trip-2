import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateFormat } from '../utils/common.js';
import { DATE_FORMAT_TIME_EDITFORM } from '../const.js';
import { EventType } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Возвращаем template для выбора типа маршрута
function createEventTypeButtonTemplate(point, type, isDisabled) {
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
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
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
function createDestinationTemplate(point, type, destination, isDisabled) {

  const destinationElement = destination.find((item) => (item.id === point.destination) || '');

  const allCity = destination.map((item) => item.name);

  function getDestinationCity() {
    const value = allCity.map((item) => `<option value="${item}">${item}</option>`).join('');
    return value;
  }
  return(
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${destinationElement?.id || ''}">
        ${type}
      </label>
      <input class="event__input  event__input--destination"
      id="event-destination-${destinationElement?.id || ''}}"
      type="text"
      name="event-destination"
      value="${destinationElement?.name || ''}"
      list="destination-list-${destinationElement?.id || ''}}"
      ${isDisabled ? 'disabled' : ''}
      required
      >
      <datalist id="destination-list-${destinationElement?.id || ''}}">
        ${getDestinationCity()}
      </datalist>
    </div>`
  );
}

// Получаем и возвращаем template для выбора даты
function createDateFromToTemplate(dateFrom, dateTo, point, isDisabled) {
  return(
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''} required>
        &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''} required>
    </div>`
  );
}

// Получаем и возвращаем template для выбора цены
function createPriceTemplate(point, isDisabled) {
  return(
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${point.id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${point.id}" type="number" name="event-price" min="1" max="99999" value="${isFinite(point.basePrice) ? point.basePrice : 1}" ${isDisabled ? 'disabled' : ''}>
    </div>`
  );
}

// Получаем и возвращаем template для офферов
function createOffersTemplate(offers, point, isDisabled) {
  const availableOffers = offers.find((offerGroup) => offerGroup.type === point.type)?.offers || [];

  if (availableOffers.length === 0) {
    return '';
  }

  function getAvailableOffersTemplate() {
    return availableOffers.map((offer) => `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${offer.id}"
          type="checkbox"
          name="${offer.title}"
          data-offer-id="${offer.id}"
          ${point.offers.includes(offer.id) ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;<span>${offer.price}</span>
        </label>
      </div>
    `).join('');
  }

  return `
    <section class="event__details">
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${getAvailableOffersTemplate()}
        </div>
      </section>
    </section>`;
}


// Получаем и возвращаем template для фотографий
function createPhotoTemplate(pictures){
  if(pictures.length === 0){
    return '';
  }

  function getPhotos() {
    const arrayPic = pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`);
    return arrayPic;
  }
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getPhotos()}
      </div>
    </div>`;
}

function getDescriptionTeplate(point, destination){

  const description = destination.find((item) => item.id === point.destination)?.description || '';

  if(description.length === 0){
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${destination.find((item) => item.id === point.destination).description}
      </p>
    </section>`;
}

function createEditFormTemplate(point, destination, offers, isDisabled, isSaving, isDeleting, isNewPoint){

  const { dateFrom, dateTo, type } = point;
  const dateFormattedStart = getDateFormat(dateFrom, DATE_FORMAT_TIME_EDITFORM);
  const dateFormattedEnd = getDateFormat(dateTo, DATE_FORMAT_TIME_EDITFORM);

  // возвращем template формы редактирования
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createEventTypeButtonTemplate(point, type, isDisabled)}
          ${createDestinationTemplate(point, type, destination, isDisabled)}
          ${createDateFromToTemplate(dateFormattedStart, dateFormattedEnd, point, isDisabled)}
          ${createPriceTemplate(point, isDisabled)}
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${isDeleting ? 'Deleting...' : `${isNewPoint ? 'cancel' : 'Delete'}`}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">
              Open event
            </span>
          </button>
        </header>
          ${createOffersTemplate(offers, point, isDisabled)}
          ${getDescriptionTeplate(point, destination)}
          ${createPhotoTemplate(destination.find((item) => item.id === point.destination)?.pictures || '')}
        </section>
      </form>
    </li>`
  );
}
export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #destination = null;
  #offers = null;
  #isDisabled = null;
  #isSaving = null;
  #isDeleting = null;
  #isNewPoint = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #initialState = null;

  constructor({
    point,
    destination,
    offers,
    onFormSubmit,
    onDeleteClick,
    isDisabled = false,
    isSaving = false,
    isDeleting = false
  }) {
    super();
    this.#initialState = PointEditView.parsePointToState(point);
    if(!point){
      point = {
        basePrice: 0,
        dateFrom: null,
        dateTo: null,
        destination: '',
        isFavorite: false,
        offers: [],
        type: EventType.FLIGHT,
      };
      this.#isNewPoint = true;
    }

    // Сохраняем состояния в компоненте
    this._setState({
      ...PointEditView.parsePointToState(point),
      isDisabled,
      isSaving,
      isDeleting,
    });

    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#destination = destination;
    this.#offers = offers;
    this.#isDisabled = isDisabled;
    this.#isSaving = isSaving;
    this.#isDeleting = isDeleting;

    this._restoreHandlers();
  }
  // Методы для управления состояниями

  setDeleting(isDeleting) {
    this.#isDeleting = isDeleting;
    this.#isDisabled = isDeleting;

    this.updateElement({
      isDeleting,
      isDisabled: isDeleting
    });
  }

  setSaving(isSaving) {
    this.#isSaving = isSaving;
    this.#isDisabled = isSaving;

    this.updateElement({
      isSaving,
      isDisabled: isSaving
    });
  }

  get template() {
    return createEditFormTemplate(
      this._state,
      this.#destination,
      this.#offers,
      this.#isDisabled,
      this.#isSaving,
      this.#isDeleting,
      this.#isNewPoint);
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  _restoreHandlers(){
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#deleteHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    // this.element.querySelectorAll('.event__offer-checkbox').forEach((offer) => offer.addEventListener('change', this.#offerChangeHandler));
    this.element.querySelectorAll('.event__offer-label').forEach((label) => {
      label.addEventListener('click', this.#offerLabelClickHandler);
    });
    this.#setDatePicker();
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  }


  #offerLabelClickHandler = (evt) => {
    if(this.#isDisabled || this.#isSaving){
      return;
    }
    const offerId = evt.target.closest('.event__offer-selector').querySelector('input').dataset.offerId;

    if (!offerId) {
      return;
    }

    const updatedOffers = this._state.offers.includes(offerId)
      ? this._state.offers.filter((id) => id !== offerId)
      : [...this._state.offers, offerId];

    this.updateElement({
      ...this._state,
      offers: updatedOffers
    });
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.className === 'event__reset-btn' || this.#isNewPoint){
      this.#handleDeleteClick();
    } else {
      this.reset(this.#initialState);
      this.#handleFormSubmit(PointEditView.parseStateToPoint(this.#initialState));
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #setDatePicker() {
    const dateFrom = this.element.querySelector('input[name="event-start-time"]');
    const dateTo = this.element.querySelector('input[name="event-end-time"]');

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
    }

    this.#datepickerStart = flatpickr(dateFrom, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#dateFromChangeHandler,
      maxDate: this._state.dateTo,
    });

    this.#datepickerEnd = flatpickr(dateTo, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      minDate: dayjs(this._state.dateFrom).add(1, 'minute').toDate(),
      onChange: this.#dateToChangeHandler,
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({ dateFrom: userDate });
    this.#datepickerEnd.set('minDate', userDate);
    if (new Date(this._state.dateTo) < userDate) {
      this.updateElement({ dateTo: userDate });
      this.#datepickerEnd.setDate(userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    if (new Date(userDate) < new Date(this._state.dateFrom)) {
      this.#datepickerEnd.setDate(this._state.dateFrom);
      this.updateElement({ dateTo: this._state.dateFrom });
      return;
    }
    this.updateElement({ dateTo: userDate });
  };

  // #offerChangeHandler = (evt) => {
  //   const offerId = evt.target.dataset.offerId;
  //   console.log(evt.target);


  //   if (!offerId) {
  //     return;
  //   }

  //   const updatedOffers = this._state.offers.includes(offerId)
  //     ? this._state.offers.filter((id) => id !== offerId)
  //     : [...this._state.offers, offerId];

  //   this.updateElement({
  //     ...this._state,
  //     offers: updatedOffers
  //   });
  // };

  #findDestination = (evt) => {
    const cityName = evt.target.value;
    return this.#destination.find((dest) => dest.name === cityName) || this.#destination.find((item) => item.id === this._state.destination);
  };

  #priceChangeHandler = (evt) => {
    const numericValue = Number(evt.target.value);
    this.updateElement({
      ...this._state,
      basePrice: isNaN(numericValue) ? 0 : numericValue
    });
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
      destination: newDestination.id || ''
    });
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}

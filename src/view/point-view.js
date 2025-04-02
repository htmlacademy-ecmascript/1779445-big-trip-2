import { getDateFormat, getDiffTime } from '../utils/common.js';
import { DATE_FORMAT_DAY, DATE_FORMAT_TIME } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createPointTemplate(point, offers, destination){

  const { dateFrom, dateTo, basePrice, isFavorite, type } = point;
  const dateFormattedDay = getDateFormat(dateFrom, DATE_FORMAT_DAY);

  const dateFormattedStart = getDateFormat(dateFrom, DATE_FORMAT_TIME);
  const dateFormattedEnd = getDateFormat(dateTo, DATE_FORMAT_TIME);
  const diffTime = getDiffTime(dateFrom, dateTo);

  const ifFavoriteElement = isFavorite ? 'event__favorite-btn--active' : '';

  function createOffers() {
    if (Object.keys(offers).length === 0) {
      return '';
    }

    const availableOffers = offers.find((offerGroup) => offerGroup.type === point.type)?.offers || [];
    const selectedOffers = availableOffers.filter((offer) => point.offers.includes(offer.id));

    return selectedOffers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `).join('');
  }

  function getDestination() {
    const destinationElement = destination.find((item) => item.id === point.destination);
    return destinationElement.name;
  }

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${dateFormattedDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${getDestination(destination)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${dateFormattedStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${dateFormattedEnd}</time>
          </p>
          <p class="event__duration">${diffTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${Number(basePrice)}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffers()}
        </ul>
        <button class="event__favorite-btn ${ifFavoriteElement}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, destination, offers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}

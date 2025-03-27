import AbstractView from '../framework/view/abstract-view';

function createNewPointButtonTEmplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTEmplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}

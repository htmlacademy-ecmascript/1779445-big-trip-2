import { remove, render, RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../const.js';

const { AFTERBEGIN } = RenderPosition;

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;
  #pointsModel = null;
  #noPoint = null;

  constructor({ pointListContainer, onDataChange, onDestroy, pointsModel, noPoint }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
    this.#noPoint = noPoint;
  }

  init() {

    if(this.#pointEditComponent !== null){
      return;
    }

    this.#pointEditComponent = new PointEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      offers: this.#pointsModel.offers,
      destination: this.#pointsModel.destinations,
    });

    render(this.#pointEditComponent, this.#pointListContainer, AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    this.#handleDestroy();

    if(this.#pointsModel.points.length === 0) {
      this.#noPoint();
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointEditComponent.setSaving(false);
    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = async (point) => {
    try {
      this.#pointEditComponent.setSaving(true);
      const response = await this.#handleDataChange(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point,
      );
      if(response){
        this.destroy();
      }
    } catch {
      this.#pointEditComponent.setSaving(false);
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

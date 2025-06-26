export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
}

export const cardTemplateSelector = '#card-template'
export const cardsContainer = document.querySelector('.places__list')
export const profileEditButton = document.querySelector('.profile__edit-button')
export const profileAddButton = document.querySelector('.profile__add-button')
export const profileAvatarButton = document.querySelector('.profile__avatar')
export const popupEditProfile = document.querySelector('.popup_type_edit')
export const popupAddCard = document.querySelector('.popup_type_add')
export const popupImage = document.querySelector('.popup_type_image')
export const popupAvatar = document.querySelector('.popup_type_avatar')
export const popupConfirm = document.querySelector('.popup_type_confirm')
export const formEditProfile = document.querySelector(
  '.popup_type_edit .popup__form'
)
export const formAddCard = document.querySelector(
  '.popup_type_add .popup__form'
)
export const formAvatar = document.querySelector(
  '.popup_type_avatar .popup__form'
)
export const nameInput = document.querySelector('.popup__input_type_name')
export const jobInput = document.querySelector('.popup__input_type_job')
export const profileName = document.querySelector('.profile__title')
export const profileJob = document.querySelector('.profile__description')
export const profileAvatar = document.querySelector('.profile__image')

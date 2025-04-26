import '../pages/index.css'
import {
  initialCards,
  loadUserData,
  updateUserData,
  addNewCard,
  deleteCardFetch,
  updateUserAvatar,
} from './components/api.js'
import { addCard, deleteCard, toggleLike } from './components/card.js'
import {
  openPopup,
  closePopup,
  closeByOverlay,
  closeByEsc,
  closeByCrossButtonClick,
} from './components/modal.js'
import { enableValidation, resetValidation } from './components/validation.js'

const listCard = document.querySelector('.places__list')
const popupEdit = document.querySelector('.popup_type_edit')
const popupNew = document.querySelector('.popup_type_new-card')
const popupImage = document.querySelector('.popup_type_image')
const buttonOpenFormEditProfile = document.querySelector(
  '.profile__edit-button'
)
const popupAll = document.querySelectorAll('.popup')
const buttonOpenFormAddCard = document.querySelector('.profile__add-button')
const formEditProfile = document.querySelector('form[name="edit-profile"]')
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')
const formAddCard = document.querySelector('form[name="new-place"]')
const cardNameInput = document.querySelector('.popup__input_type_card-name')
const cardUrlInput = document.querySelector('.popup__input_type_url')
const popupImageContent = popupImage.querySelector('.popup__image')
const popupCaption = popupImage.querySelector('.popup__caption')
const name = document.querySelector('.profile__title')
const job = document.querySelector('.profile__description')
const openFormEditAvatar = document.querySelector('.profile__image')
const popupAvatar = document.querySelector('.popup_type_avatar')
const formEditAvatar = document.querySelector('form[name="avatar"]')
const avatarInput = document.querySelector('.popup__input_type_avatar-url')
let currentUserId = null

buttonOpenFormEditProfile.addEventListener('click', function () {
  nameInput.value = name.textContent
  jobInput.value = job.textContent
  resetValidation(popupEdit, config)
  openPopup(popupEdit)
})

buttonOpenFormAddCard.addEventListener('click', function () {
  resetValidation(popupNew, config)
  openPopup(popupNew)
})

openFormEditAvatar.addEventListener('click', function () {
  resetValidation(popupAvatar, config)
  openPopup(popupAvatar)
})

popupAll.forEach((popup) => {
  popup.addEventListener('click', closeByOverlay)
})

popupAll.forEach((popup) => {
  popup.addEventListener('click', closeByCrossButtonClick)
})

formEditProfile.addEventListener('submit', submitEditProfileForm)
formAddCard.addEventListener('submit', handleCardSubmit)
formEditAvatar.addEventListener('submit', submitEditAvatarForm)

function openImagePopup(card) {
  popupImageContent.src = card.link
  popupImageContent.alt = card.name
  popupCaption.textContent = card.name
  openPopup(popupImage)
}

function submitEditProfileForm(evt) {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  submitButton.disabled = true
  submitButton.textContent = 'Сохранение...'
  const userData = {
    name: nameInput.value,
    about: jobInput.value,
  }
  updateUserData(userData)
    .then((updatedUser) => {
      name.textContent = updatedUser.name
      job.textContent = updatedUser.about
      closePopup(popupEdit)
    })
    .catch((err) => {
      console.error('Ошибка при обновлении данных профиля:', err)
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить'
    })
}

function submitEditAvatarForm(evt) {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  submitButton.disabled = true
  submitButton.textContent = 'Сохранение...'
  const avatarUrl = avatarInput.value
  updateUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      document.querySelector(
        '.profile__image'
      ).style.backgroundImage = `url('${updatedUser.avatar}')`
      console.log(updatedUser.avatar)
      closePopup(popupAvatar)
      formEditAvatar.reset()
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err)
    })
    .finally(() => {
      submitButton.disabled = false
      submitButton.textContent = 'Сохранить'
    })
}

function handleCardSubmit(evt) {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  submitButton.disabled = true
  submitButton.textContent = 'Сохранение...'
  const cardUrlValue = cardUrlInput.value
  const cardNameValue = cardNameInput.value
  const dataCard = {
    name: cardNameValue,
    link: cardUrlValue,
  }

  addNewCard(dataCard)
    .then((dataCard) => {
      const newCard = addCard(
        dataCard,
        deleteCard,
        toggleLike,
        openImagePopup,
        currentUserId,
        deleteCardFetch
      )
      listCard.prepend(newCard)
      formAddCard.reset()
      closePopup(popupNew)
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err)
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить'
    })
}

const config = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
}
enableValidation(config)

Promise.all([loadUserData(), initialCards()])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id
    name.textContent = userData.name
    job.textContent = userData.about
    if (userData.avatar) {
      document.querySelector(
        '.profile__image'
      ).style.backgroundImage = `url('${userData.avatar}')`
    }
    cardsData.forEach((item) => {
      const newCard = addCard(
        item,
        deleteCard,
        toggleLike,
        openImagePopup,
        currentUserId,
        deleteCardFetch
      )
      listCard.append(newCard)
    })
  })
  .catch((err) => {
    console.log('Ошибка при загрузке данных:', err)
  })

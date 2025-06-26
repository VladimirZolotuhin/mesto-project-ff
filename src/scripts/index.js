import { enableValidation, clearValidation } from '../components/validation.js'
import '../pages/index.css'
import { createCard, deleteCard, putLike } from '../components/card.js'
import { openModal, closeModal, closePopup } from '../components/modal.js'
import {
  getInitialCards,
  addCardToServer,
  editProfile,
  getUserProfile,
  addLikeToServer,
  removeLikeFromServer,
  deleteCardFromServer,
  updateAvatar,
} from './api.js'

const formEditProfile = document.querySelector(
  '.popup__form[name="edit-profile"]'
)
const nameInput = formEditProfile.querySelector('.popup__input_type_name')
const jobInput = formEditProfile.querySelector('.popup__input_type_description')
const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')

const formNewCard = document.querySelector('.popup__form[name="new-place"]')
const placeNameInput = formNewCard.querySelector('.popup__input_type_card-name')
const placeLinkInput = formNewCard.querySelector('.popup__input_type_url')
const popupAddCard = document.querySelector('.popup_type_new-card')
const buttonAvatar = document.querySelector('.profile__image')
const popupAvatar = document.querySelector('.popup_type_edit-avatar')
const formEditAvatar = document.querySelector(
  '.popup__form[name="edit-avatar"]'
)
const avatarInput = document.querySelector('.popup__input_type_url_avatar')

const editButton = document.querySelector('.profile__edit-button')
const popupEditCard = document.querySelector('.popup_type_edit')
const addButton = document.querySelector('.profile__add-button')

const placesList = document.querySelector('.places__list')
const popups = document.querySelectorAll('.popup')
let currentUserId
const popupImage = document.querySelector('.popup_type_image')
const imageElement = popupImage.querySelector('.popup__image')
const captionElement = popupImage.querySelector('.popup__caption')

const onSubmitButton = (element, selector) => {
  const saveButton = element.querySelector(selector)
  const originalText = saveButton.textContent
  saveButton.textContent = 'Сохранение...'
  saveButton.disabled = true

  const onFinally = () => {
    saveButton.textContent = originalText
    saveButton.disabled = false
  }

  return onFinally
}

function handleDeleteCard(cardElement, cardId) {
  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove()
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err)
    })
}

function handleLikeCard(likeButton, counter, item) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active')
  const action = isLiked ? removeLikeFromServer : addLikeToServer

  action(item._id)
    .then((updatedCard) => {
      putLike(likeButton)
      counter.textContent = updatedCard.likes.length
      item.likes = updatedCard.likes
    })
    .catch((err) => {
      console.error('Ошибка при лайке:', err)
    })
}

function handleImageClick(link, name) {
  openImagePopup(link, name)
}

closePopup(popups)

function openImagePopup(link, name) {
  imageElement.src = link
  imageElement.alt = name
  captionElement.textContent = name
  openModal(popupImage)
}

function handleNewCardSubmit(evt) {
  evt.preventDefault()

  const onFinally = onSubmitButton(formNewCard, '.popup__button')

  const newCard = { name: placeNameInput.value, link: placeLinkInput.value }

  addCardToServer(newCard)
    .then((card) => {
      const cardElement = createCard(
        card,
        (cardEl) => handleDeleteCard(cardEl, card._id),
        handleLikeCard,
        handleImageClick,
        currentUserId
      )
      placesList.prepend(cardElement)
      closeModal(popupAddCard)
      formNewCard.reset()
      clearValidation(formNewCard, validationConfig)
    })
    .catch((err) => {
      console.error('Ошибка при добавлении карточки:', err)
    })
    .finally(onFinally)
}

formNewCard.addEventListener('submit', handleNewCardSubmit)

addButton.addEventListener('click', () => openModal(popupAddCard))

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent
  jobInput.value = profileDescription.textContent
  clearValidation(formEditProfile, validationConfig)
  openModal(popupEditCard)
})

buttonAvatar.addEventListener('click', () => openModal(popupAvatar))

window.addEventListener('load', () => {
  Promise.all([getUserProfile(), getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id
      profileTitle.textContent = userData.name
      profileDescription.textContent = userData.about
      buttonAvatar.style.backgroundImage = `url('${userData.avatar}')`

      cards.forEach((item) => {
        const cardElement = createCard(
          item,
          handleDeleteCard,
          handleLikeCard,
          handleImageClick,
          currentUserId
        )
        placesList.append(cardElement)
      })
    })
    .catch((err) => {
      console.error('Ошибка при загрузке данных:', err)
    })
})

formEditAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault()

  const onFinally = onSubmitButton(formEditAvatar, '.popup__button')

  const newAvatarUrl = avatarInput.value

  updateAvatar(newAvatarUrl)
    .then(() => {
      buttonAvatar.style.backgroundImage = `url('${newAvatarUrl}')`
      formEditAvatar.reset()
      closeModal(popupAvatar)
      clearValidation(formEditAvatar, validationConfig)
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err)
    })
    .finally(onFinally)
})

formEditProfile.addEventListener('submit', (evt) => {
  evt.preventDefault()

  const name = nameInput.value
  const about = jobInput.value

  const onFinally = onSubmitButton(formEditProfile, '.popup__button')

  editProfile(name, about)
    .then((data) => {
      profileTitle.textContent = data.name
      profileDescription.textContent = data.about
      closeModal(popupEditCard)
    })
    .catch((err) => {
      console.error('Ошибка при обновлении профиля:', err)
      alert('Произошла ошибка при обновлении профиля: ' + err.message)
    })
    .finally(onFinally)
})

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active',
}

enableValidation(validationConfig)

import '../pages/index.css'
import { initialCards } from './components/cards.js'
import { addCard, deleteCard, toggleLike } from './components/card.js'
import {
  openPopup,
  closePopup,
  closeByOverlay,
  closeByCrossButtonClick,
} from './components/modal.js'

// @todo: Темплейт карточки
const listCard = document.querySelector('.places__list')

initialCards.forEach((item) => {
  const newCard = addCard(item, deleteCard, toggleLike, openImagePopup)
  listCard.append(newCard)
})

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
const popupImageCaption = popupImage.querySelector('.popup__caption')
const profileName = document.querySelector('.profile__title')
const profileJob = document.querySelector('.profile__description')

buttonOpenFormEditProfile.addEventListener('click', function () {
  nameInput.value = profileName.textContent
  jobInput.value = profileJob.textContent
  openPopup(popupEdit)
})

//profileAvatar.src = './images/avatar.jpg'

buttonOpenFormAddCard.addEventListener('click', function () {
  cardNameInput.value = ''
  cardUrlInput.value = ''
  openPopup(popupNew)
})

popupAll.forEach((popup) => {
  popup.addEventListener('mousedown', closeByOverlay)
  popup.addEventListener('mousedown', closeByCrossButtonClick)
})

formEditProfile.addEventListener('submit', submitEditProfileForm)
formAddCard.addEventListener('submit', handleCardSubmit)

function openImagePopup(card) {
  popupImageContent.src = card.link
  popupImageContent.alt = card.name
  popupImageCaption.textContent = card.name
  openPopup(popupImage)
}

function submitEditProfileForm(evt) {
  evt.preventDefault()
  const jobValue = jobInput.value
  const nameValue = nameInput.value
  profileJob.textContent = jobValue
  profileName.textContent = nameValue
  closePopup(popupEdit)
}

function handleCardSubmit(evt) {
  evt.preventDefault()

  const cardUrlValue = cardUrlInput.value
  const cardNameValue = cardNameInput.value

  if (!cardNameValue || !cardUrlValue) {
    alert('Заполните все поля!')
    return
  }

  const dataCard = {
    name: cardNameValue,
    link: cardUrlValue,
  }

  const newCard = addCard(dataCard, deleteCard, toggleLike, openImagePopup)
  listCard.prepend(newCard)
  formAddCard.reset()
  closePopup(popupNew)
}

// @todo: DOM узлы
// const initialCard = initialCards.forEach(function(item) {
//     item;
// });

// @todo: Функция создания карточки

// @todo: Вывести карточки на страницу

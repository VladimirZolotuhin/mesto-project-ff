import {
  getInitialCards,
  loadUserData,
  updateUserData,
  addNewCard,
  updateUserAvatar,
  deleteCardFetch,
} from '../components/api.js'
import { createCard, setLoadingState } from '../components/card.js' // Импортируем setLoadingState
import { enableValidation, resetValidation } from '../components/validation.js'
import { openPopup, closePopup } from '../components/modal.js'
import {
  validationConfig,
  cardTemplateSelector,
  cardsContainer,
  profileEditButton,
  profileAddButton,
  profileAvatarButton,
  popupEditProfile,
  popupAddCard,
  popupImage,
  popupAvatar,
  popupConfirm,
  formEditProfile,
  formAddCard,
  formAvatar,
  nameInput,
  jobInput,
  profileName,
  profileJob,
  profileAvatar,
} from '../utils/constants.js'

let currentUserId = null

// Загрузка данных пользователя и карточек
Promise.all([loadUserData(), getInitialCards()])
  .then(([userData, cardsData]) => {
    console.log('Данные пользователя:', userData)
    console.log('Данные карточек:', cardsData)

    if (
      !userData ||
      !userData.name ||
      !userData.about ||
      !userData.avatar ||
      !userData._id
    ) {
      throw new Error('Данные пользователя неполные или отсутствуют')
    }
    if (!cardsData || !Array.isArray(cardsData)) {
      throw new Error('Данные карточек неполные или отсутствуют')
    }

    if (!profileName || !profileJob || !profileAvatar || !cardsContainer) {
      throw new Error(
        'Один из DOM-элементов не найден: profileName, profileJob, profileAvatar или cardsContainer'
      )
    }

    profileName.textContent = userData.name
    profileJob.textContent = userData.about
    profileAvatar.src = userData.avatar
    currentUserId = userData._id

    cardsData.forEach((cardData) => {
      if (
        !cardData ||
        !cardData.name ||
        !cardData.link ||
        !cardData.owner ||
        !cardData._id
      ) {
        console.warn('Некорректные данные карточки:', cardData)
        return
      }
      const cardElement = createCard(
        cardData,
        toggleLike,
        openImagePopup,
        currentUserId
      )
      if (!cardElement) {
        console.warn('Не удалось создать карточку для данных:', cardData)
        return
      }
      cardsContainer.prepend(cardElement)
    })
  })
  .catch((err) => {
    console.error('Ошибка при загрузке данных:', err)
  })

// Функция переключения лайков
function toggleLike(likeButton, updatedCard) {
  likeButton.classList.toggle('card__like-button_active')
  const likeCounter = likeButton.nextElementSibling
  likeCounter.textContent = updatedCard.likes.length
}

// Открытие попапа с изображением
function openImagePopup(cardData) {
  const imageElement = popupImage.querySelector('.popup__image')
  const captionElement = popupImage.querySelector('.popup__caption')
  imageElement.src = cardData.link
  imageElement.alt = cardData.name
  captionElement.textContent = cardData.name
  openPopup(popupImage)
}

// Обработчик открытия формы редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent
  jobInput.value = profileJob.textContent
  resetValidation(formEditProfile, validationConfig)
  openPopup(popupEditProfile)
})

// Обработчик открытия формы добавления карточки
profileAddButton.addEventListener('click', () => {
  formAddCard.reset()
  resetValidation(formAddCard, validationConfig)
  openPopup(popupAddCard)
})

// Обработчик открытия формы редактирования аватара
profileAvatarButton.addEventListener('click', () => {
  resetValidation(formAvatar, validationConfig)
  openPopup(popupAvatar)
})

// Обработчик формы редактирования профиля
formEditProfile.addEventListener('submit', (evt) => {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  setLoadingState(submitButton, true)

  const userData = {
    name: nameInput.value,
    about: jobInput.value,
  }

  updateUserData(userData)
    .then((res) => {
      profileName.textContent = res.name
      profileJob.textContent = res.about
      closePopup(popupEditProfile)
    })
    .catch((err) => console.log(err))
    .finally(() => setLoadingState(submitButton, false))
})

// Обработчик формы добавления карточки
formAddCard.addEventListener('submit', (evt) => {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  setLoadingState(submitButton, true)

  const cardData = {
    name: evt.target.querySelector('.popup__input_type_card-name').value,
    link: evt.target.querySelector('.popup__input_type_url').value,
  }

  addNewCard(cardData)
    .then((res) => {
      const cardElement = createCard(
        res,
        toggleLike,
        openImagePopup,
        currentUserId
      )
      cardsContainer.prepend(cardElement)
      closePopup(popupAddCard)
    })
    .catch((err) => console.log(err))
    .finally(() => setLoadingState(submitButton, false, 'Создать'))
})

// Обработчик формы редактирования аватара
formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault()
  const submitButton = evt.target.querySelector('.popup__button')
  setLoadingState(submitButton, true)

  const avatarData = {
    avatar: evt.target.querySelector('.popup__input_type_avatar').value,
  }

  updateUserAvatar(avatarData)
    .then((res) => {
      profileAvatar.src = res.avatar
      closePopup(popupAvatar)
    })
    .catch((err) => console.log(err))
    .finally(() => setLoadingState(submitButton, false))
})

enableValidation(validationConfig)

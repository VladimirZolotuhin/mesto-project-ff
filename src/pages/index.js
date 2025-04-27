import {
  getInitialCards,
  loadUserData,
  updateUserData,
  addNewCard,
  updateUserAvatar,
} from '../components/api.js'
import { createCard, setLoadingState } from '../components/card.js'
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

// Функция отображения ошибки в попапе
function renderError(err) {
  console.error('Ошибка:', err)
  const errorPopup = document.createElement('div')
  errorPopup.className = 'popup popup_type_error popup_opened'
  errorPopup.innerHTML = `
    <div class="popup__container">
      <button type="button" class="popup__close"></button>
      <h3 class="popup__title">Ошибка</h3>
      <p class="popup__error-message">${err}</p>
    </div>
  `
  document.body.appendChild(errorPopup)

  const closeButton = errorPopup.querySelector('.popup__close')
  closeButton.addEventListener('click', () => closePopup(errorPopup))
  errorPopup.addEventListener('click', (evt) => {
    if (evt.target === errorPopup) {
      closePopup(errorPopup)
    }
  })
}

// Загрузка данных пользователя и карточек последовательно
loadUserData()
  .then((userData) => {
    console.log('Получены данные пользователя:', userData)
    if (!profileName || !profileJob || !profileAvatar) {
      throw new Error('Не найдены элементы профиля в DOM')
    }
    profileName.textContent = userData.name
    profileJob.textContent = userData.about
    profileAvatar.src = userData.avatar
    currentUserId = userData._id
    console.log('Обновлены элементы профиля:', {
      name: profileName.textContent,
      job: profileJob.textContent,
      avatar: profileAvatar.src,
    })

    // Загружаем карточки только после получения userId
    return getInitialCards()
  })
  .then((cardsData) => {
    console.log('Получены карточки:', cardsData)
    if (!cardsContainer) {
      throw new Error('Не найден контейнер для карточек в DOM')
    }
    cardsData.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        toggleLike,
        openImagePopup,
        currentUserId
      )
      if (!cardElement) {
        console.warn('Не удалось создать карточку:', cardData)
        return
      }
      cardsContainer.append(cardElement)
      console.log('Добавлена карточка в DOM:', cardElement)
    })
  })
  .catch((err) => {
    renderError(`Не удалось загрузить данные: ${err}`)
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
  formAvatar.reset()
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
    .catch((err) => {
      renderError(`Не удалось обновить профиль: ${err}`)
    })
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
      formAddCard.reset()
    })
    .catch((err) => {
      renderError(`Не удалось добавить карточку: ${err}`)
    })
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
      formAvatar.reset()
    })
    .catch((err) => {
      renderError(`Не удалось обновить аватар: ${err}`)
    })
    .finally(() => setLoadingState(submitButton, false))
})

enableValidation(validationConfig)

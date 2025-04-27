import { addLike, removeLike, deleteCardFetch } from './api.js'

export function createCard(
  dataCard,
  toggleLike,
  openImagePopup,
  currentUserId
) {
  const cardTemplate = document.querySelector('#card-template').content
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const likeButton = cardElement.querySelector('.card__like-button')
  const deleteButton = cardElement.querySelector('.card__delete-button')
  const likeCounter = cardElement.querySelector('.card__like-counter')

  cardImage.src = dataCard.link
  cardImage.alt = dataCard.name
  cardTitle.textContent = dataCard.name
  likeCounter.textContent = dataCard.likes.length

  const isLiked = dataCard.likes.some((like) => like._id === currentUserId)
  if (isLiked) {
    likeButton.classList.add('card__like-button_active')
  }

  if (dataCard.owner._id !== currentUserId) {
    deleteButton.style.display = 'none'
  }

  likeButton.addEventListener('click', () => {
    const isCurrentlyLiked = likeButton.classList.contains(
      'card__like-button_active'
    )
    const likePromise = isCurrentlyLiked
      ? removeLike(dataCard._id)
      : addLike(dataCard._id)
    likePromise
      .then((updatedCard) => {
        toggleLike(likeButton, updatedCard)
      })
      .catch((err) => console.log(err))
  })

  deleteButton.addEventListener('click', () => {
    const confirmForm = document.querySelector('.popup__form_type_confirm')
    confirmForm.dataset.cardId = dataCard._id
    confirmForm.onSubmit = (evt) => {
      evt.preventDefault()
      const submitButton = evt.target.querySelector('.popup__button')
      setLoadingState(submitButton, true)

      deleteCardFetch(dataCard._id)
        .then(() => {
          cardElement.remove()
          closePopup(document.querySelector('.popup_type_confirm'))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingState(submitButton, false, 'Да'))
    }
    openPopup(document.querySelector('.popup_type_confirm'))
  })

  cardImage.addEventListener('click', () => {
    openImagePopup(dataCard)
  })

  return cardElement
}

export function setLoadingState(button, isLoading, defaultText = 'Сохранить') {
  if (isLoading) {
    button.textContent = 'Сохранение...'
    button.disabled = true
  } else {
    button.textContent = defaultText
    button.disabled = false
  }
}

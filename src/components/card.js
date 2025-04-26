import { addLike, removeLike } from './api'

const cardTemplate = document.querySelector('#card-template').content
function getCardTemplate() {
  return cardTemplate.querySelector('.card').cloneNode(true)
}

export function addCard(
  dataCard,
  deleteCard,
  toggleLike,
  openImagePopup,
  currentUserId,
  deleteCardFetch
) {
  const cardElement = getCardTemplate()
  const cardImage = cardElement.querySelector('.card__image')
  cardImage.src = dataCard.link
  cardImage.alt = dataCard.name
  cardElement.querySelector('.card__title').textContent = dataCard.name
  const deleteButton = cardElement.querySelector('.card__delete-button')
  if (dataCard.owner._id !== currentUserId) {
    deleteButton.remove()
  }
  deleteButton.addEventListener('click', function () {
    deleteCard(deleteButton, deleteCardFetch, dataCard._id)
  })

  const likeButton = cardElement.querySelector('.card__like-button')
  const likeCounter = cardElement.querySelector('.card__like-counter')
  likeCounter.textContent = dataCard.likes.length
  const isLiked = dataCard.likes.some((like) => like._id === currentUserId)
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active')
  }
  likeButton.addEventListener('click', (evt) => {
    toggleLike(evt, dataCard._id, likeCounter)
  })
  cardImage.addEventListener('click', function () {
    openImagePopup(dataCard)
  })
  return cardElement
}

export function deleteCard(deleteButton, deleteCardFetch, cardId) {
  const card = deleteButton.closest('.places__item')
  deleteCardFetch(cardId)
    .then(() => {
      card.remove()
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err)
    })
}

export function toggleLike(evt, cardId, likeCounter) {
  if (evt.target.classList.contains('card__like-button_is-active')) {
    removeLike(cardId)
      .then((res) => {
        evt.target.classList.toggle('card__like-button_is-active')
        likeCounter.textContent = res.likes.length
      })
      .catch((err) => {
        console.error('Ошибка при постановке лайка:', err)
      })
  } else {
    addLike(cardId)
      .then((res) => {
        evt.target.classList.toggle('card__like-button_is-active')
        likeCounter.textContent = res.likes.length
      })
      .catch((err) => {
        console.error('Ошибка при удалении лайка:', err)
      })
  }
}

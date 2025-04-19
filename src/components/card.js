const cardTemplate = document.querySelector('#card-template').content

function getCardTemplate() {
  return cardTemplate.querySelector('.card').cloneNode(true)
}

export function addCard(dataCard, deleteCard, toggleLike, openImagePopup) {
  const cardElement = getCardTemplate()
  const cardImage = cardElement.querySelector('.card__image')
  cardImage.src = dataCard.link
  cardImage.alt = dataCard.name
  cardElement.querySelector('.card__title').textContent = dataCard.name

  const deleteButton = cardElement.querySelector('.card__delete-button')
  deleteButton.addEventListener('click', () => deleteCard(deleteButton))

  const likeButton = cardElement.querySelector('.card__like-button')
  likeButton.addEventListener('click', toggleLike)

  cardImage.addEventListener('click', () => openImagePopup(dataCard))

  return cardElement
}

export function deleteCard(deleteButton) {
  const card = deleteButton.closest('.places__item')
  card.remove()
}

export function toggleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active')
}

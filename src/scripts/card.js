const cardTemplate = document.querySelector('#card-template').content

function getCardTemplate() {
  return cardTemplate.querySelector('.card').cloneNode(true)
}

export function addCard(cardData, handleDelete, handleLike, openImage) {
  const card = getCardTemplate()
  const image = card.querySelector('.card__image')

  image.src = cardData.link
  image.alt = cardData.name
  card.querySelector('.card__title').textContent = cardData.name

  const deleteBtn = card.querySelector('.card__delete-button')
  deleteBtn.addEventListener('click', () => {
    handleDelete(deleteBtn)
  })

  const likeBtn = card.querySelector('.card__like-button')
  likeBtn.addEventListener('click', handleLike)

  image.addEventListener('click', () => {
    openImage(cardData)
  })

  return card
}

export function deleteCard(button) {
  const cardItem = button.closest('.places__item')
  cardItem.remove()
}

export function toggleLike(event) {
  event.target.classList.toggle('card__like-button_is-active')
}

const cardTemplate = document.querySelector('#card-template').content
const places = document.querySelector('.places__list')

function createCard(cardItem, deleteCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const deleteButton = cardElement.querySelector('.card__delete-button')

  cardImage.src = cardItem.link
  cardImage.alt = cardItem.name
  cardTitle.textContent = cardItem.name

  deleteButton.addEventListener('click', function () {
    deleteCard(cardElement)
  })

  return cardElement
}

function deleteCard(cardElement) {
  cardElement.remove()
}

function addCard(cardItem) {
  const cardElement = createCard(cardItem, deleteCard)
  places.append(cardElement)
}

function renderCards() {
  initialCards.forEach(addCard)
}

renderCards()

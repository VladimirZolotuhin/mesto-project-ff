const cardTemplate = document.querySelector('#card-template').content
const cardsContainer = document.querySelector('.places__list')

const createCard = (cardItem, deleteCard) => {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const deleteButton = cardElement.querySelector('.card__delete-button')

  cardImage.src = cardItem.link
  cardImage.alt = cardItem.name
  cardTitle.textContent = cardItem.name

  deleteButton.addEventListener('click', () => deleteCard(cardElement))

  return cardElement
}

const deleteCard = (cardElement) => {
  cardElement.remove()
}

const addCard = (cardItem) => {
  const cardElement = createCard(cardItem, deleteCard)
  cardsContainer.append(cardElement)
}

const renderCards = () => {
  initialCards.forEach(addCard)
}

renderCards()

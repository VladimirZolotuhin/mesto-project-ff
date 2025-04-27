const cardTemplate = document.querySelector('#card-template').content

export function createCard(
  item,
  onDelete,
  onLike,
  onImageClick,
  currentUserId
) {
  const cardElement = cardTemplate
    .querySelector('.places__item')
    .cloneNode(true)

  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const counter = cardElement.querySelector('.counter')

  cardImage.src = item.link
  cardImage.alt = item.name
  cardTitle.textContent = item.name
  counter.textContent = item.likes.length

  const deleteButton = cardElement.querySelector('.card__delete-button')

  if (item.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () =>
      onDelete(cardElement, item._id)
    )
  } else {
    deleteButton.style.display = 'none'
  }
  deleteButton.addEventListener('click', () => onDelete(cardElement, item._id))

  const likeButton = cardElement.querySelector('.card__like-button')
  likeButton.addEventListener('click', () => onLike(likeButton, counter, item))

  if (item.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active')
  }

  cardImage.addEventListener('click', () => onImageClick(item.link, item.name))

  return cardElement
}

export function deleteCard(cardElement) {
  cardElement.remove()
}

export function putLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active')
}

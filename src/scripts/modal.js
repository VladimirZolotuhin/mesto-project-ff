const ESCAPE_KEY = 27

export function closeByEsc(event) {
  if (event.keyCode === ESCAPE_KEY) {
    const currentPopup = document.querySelector('.popup_is-opened')
    if (currentPopup) {
      closePopup(currentPopup)
    }
  }
}

export function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened')
  document.addEventListener('keydown', closeByEsc)
}

export function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened')
  document.removeEventListener('keydown', closeByEsc)
}

export function closeByOverlay(event) {
  if (event.target === event.currentTarget) {
    closePopup(event.currentTarget)
  }
}

export function closeByCrossButtonClick(event) {
  const closeButton = event.currentTarget.querySelector('.popup__close')
  if (event.target === closeButton) {
    closePopup(event.currentTarget)
  }
}

export function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened')
    closePopup(openedPopup)
  }
}

const ESC_KEYCODE = 27

export function openPopup(popup) {
  popup.classList.add('popup_is-opened')
  document.addEventListener('keydown', closeByEsc)
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened')
  document.removeEventListener('keydown', closeByEsc)
}

export function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    closePopup(document.querySelector('.popup_opened'))
  }
}

export function closeByOverlay(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget)
  }
}

export function closeByCrossButtonClick(evt) {
  const closeButton = evt.currentTarget.querySelector('.popup__close')
  if (evt.target === closeButton) {
    closePopup(evt.currentTarget)
  }
}

export function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened')
    if (openedPopup) closePopup(openedPopup)
  }
}

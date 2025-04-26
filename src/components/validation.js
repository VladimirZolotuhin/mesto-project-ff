const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.add(config.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(config.errorClass)
}

export const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(config.inputErrorClass)
  errorElement.classList.remove(config.errorClass)
  errorElement.textContent = ''
}

export function resetValidation(popup, config) {
  const form = popup.querySelector(config.formSelector)
  if (form) {
    const inputs = form.querySelectorAll(config.inputSelector)
    const button = form.querySelector(config.submitButtonSelector)
    inputs.forEach((input) => {
      hideInputError(form, input, config)
    })
    if (button) {
      button.disabled = true
      button.classList.add(config.inactiveButtonClass)
    }
  }
}

const isValid = (formElement, inputElement, config) => {
  if (inputElement.classList.contains('popup__input_text')) {
    const isValidInput = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/u.test(inputElement.value)
    if (!isValidInput && inputElement.value) {
      inputElement.setCustomValidity(
        'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы'
      )
    } else {
      inputElement.setCustomValidity('')
    }
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    )
  } else {
    hideInputError(formElement, inputElement, config)
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true
    buttonElement.classList.add(config.inactiveButtonClass)
  } else {
    buttonElement.disabled = false
    buttonElement.classList.remove(config.inactiveButtonClass)
  }
}

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  )
  const buttonElement = formElement.querySelector(config.submitButtonSelector)
  toggleButtonState(inputList, buttonElement, config)
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, config)
      toggleButtonState(inputList, buttonElement, config)
    })
  })
}

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector))
  formList.forEach((formElement) => {
    setEventListeners(formElement, config)
  })
}

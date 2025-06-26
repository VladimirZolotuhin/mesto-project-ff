function showInputError(form, input, config, errorMessage) {
  const errorElement = form.querySelector(`#${input.id}-error`)
  input.classList.add(config.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(config.errorClass)
}

function hideInputError(form, input, config) {
  const errorElement = form.querySelector(`#${input.id}-error`)
  input.classList.remove(config.inputErrorClass)
  errorElement.textContent = ''
  errorElement.classList.remove(config.errorClass)
}

function checkInputValidity(form, input, config) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.'
    )
    input.dataset.errorMessage =
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.'
  } else {
    input.setCustomValidity('')
    delete input.dataset.errorMessage
  }

  if (!input.validity.valid) {
    const message = input.dataset.errorMessage || input.validationMessage
    showInputError(form, input, config, message)
  } else {
    hideInputError(form, input, config)
  }
}

function toggleButtonState(inputs, button, config) {
  const hasInvalidInput = inputs.some((input) => !input.validity.valid)
  if (hasInvalidInput) {
    button.classList.add(config.inactiveButtonClass)
    button.disabled = true
  } else {
    button.classList.remove(config.inactiveButtonClass)
    button.disabled = false
  }
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector))
  const button = form.querySelector(config.submitButtonSelector)

  toggleButtonState(inputs, button, config)

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config)
      toggleButtonState(inputs, button, config)
    })
  })
}

export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector))
  forms.forEach((form) => {
    setEventListeners(form, config)
  })
}

export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector))
  const button = form.querySelector(config.submitButtonSelector)
  inputs.forEach((input) => {
    hideInputError(form, input, config)
  })
  button.classList.add(config.inactiveButtonClass)
  button.disabled = true
}

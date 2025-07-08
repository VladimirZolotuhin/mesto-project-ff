function showInputError(form, input, config, errorMessage) {
  const errorElement = form.querySelector(`#${input.id}-error`)
  input.classList.add(config.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(config.errorClass)
}

function clearInputError(form, input, config) {
  const errorElement = form.querySelector(`#${input.id}-error`)
  input.classList.remove(config.inputErrorClass)
  errorElement.textContent = ''
  errorElement.classList.remove(config.errorClass)
}

function isInputValid(form, input, config) {
  if (input.validity.patternMismatch) {
    input.dataset.errorMessage =
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.'
  }

  if (!input.validity.valid) {
    const message = input.dataset.errorMessage || input.validationMessage
    showInputError(form, input, config, message)
  } else {
    clearInputError(form, input, config)
  }
}

function disableSubmitButton(buttonElement, config) {
  buttonElement.classList.add(config.inactiveButtonClass)
  buttonElement.disabled = true
}

function enableSubmitButton(buttonElement, config) {
  buttonElement.classList.remove(config.inactiveButtonClass)
  buttonElement.disabled = false
}

function toggleSubmitButton(inputs, button, config) {
  const hasInvalidInput = inputs.some((input) => !input.validity.valid)
  if (hasInvalidInput) {
    disableSubmitButton(button, config)
  } else {
    enableSubmitButton(button, config)
  }
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector))
  const button = form.querySelector(config.submitButtonSelector)

  toggleSubmitButton(inputs, button, config)

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isInputValid(form, input, config)
      toggleSubmitButton(inputs, button, config)
    })
  })
}

export function startValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector))
  forms.forEach((form) => {
    setEventListeners(form, config)
  })
}

export function resetValidationErrors(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector))
  const button = form.querySelector(config.submitButtonSelector)

  inputs.forEach((input) => {
    clearInputError(form, input, config)
  })

  disableSubmitButton(button, config)
}

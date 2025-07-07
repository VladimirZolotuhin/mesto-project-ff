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
    clearInputError(form, input, config)
  }
}

function toggleSubmitButton(inputs, button, config) {
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
  button.classList.add(config.inactiveButtonClass)
  button.disabled = true
}

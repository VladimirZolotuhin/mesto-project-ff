import { checkResponse } from '../utils/checkResponse'

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-39',
  headers: {
    authorization: 'c5e72a89-a65b-48f3-9a61-0de380dbb0ff',
    'Content-Type': 'application/json',
  },
}

export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkResponse)
}
// Добавление новой карточки на сервер
export function addCardToServer(card) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: card.name,
      link: card.link,
    }),
  }).then(checkResponse)
}

// Редактирование профиля
export function editProfile(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(checkResponse)
}
// Получение профиля пользователя
export function getUserProfile() {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers,
  }).then(checkResponse)
}

// Добавление лайка на карточку
export function addLikeToServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  }).then(checkResponse)
}

// Удаление лайка с карточки
export function removeLikeFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(checkResponse)
}

// Удаление карточки
export function deleteCardFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(checkResponse)
}
// Обновление аватара
export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
  }).then(checkResponse)
}

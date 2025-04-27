import { enableValidation, clearValidation } from "../components/validation.js";
import "../pages/index.css";
import { createCard, deleteCard, putLike } from "../components/card.js";
import { openModal, closeModal, closePopup } from "../components/modal.js";
import {
  getInitialCards,
  addCardToServer,
  editProfile,
  getUserProfile,
  addLikeToServer,
  removeLikeFromServer,
  deleteCardFromServer,
  updateAvatar,
} from "./api.js";

// Работа с профилем
const formEditProfile = document.querySelector(
  '.popup__form[name="edit-profile"]'
); // ФОРМА ПРОФИЛЯ
const nameInput = formEditProfile.querySelector(".popup__input_type_name"); // ИНПУТ 1 (ИМЯ)
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
); //ИНПУТ 2 (О СЕБЕ)
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Работа с добавлением новой карточки
const formNewCard = document.querySelector('.popup__form[name="new-place"]'); // ФОРМА ДОБАВЛЕНИЯ КАРТОЧКИ
const placeNameInput = formNewCard.querySelector(
  ".popup__input_type_card-name"
); // ИНПУТ 3 (ИМЯ КАРТОЧКИ)
const placeLinkInput = formNewCard.querySelector(".popup__input_type_url"); // ИНПУТ 4 (ССЫЛКА)
const popupAddCard = document.querySelector(".popup_type_new-card");
const buttonAvatar = document.querySelector(".profile__image");
const popupAvatar = document.querySelector(".popup_type_edit-avatar");
const formEditAvatar = document.querySelector(
  '.popup__form[name="edit-avatar"]'
);
const avatarInput = document.querySelector(".popup__input_type_url_avatar");

const editButton = document.querySelector(".profile__edit-button");
const popupEditCard = document.querySelector(".popup_type_edit");
const addButton = document.querySelector(".profile__add-button");

const placesList = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup");
let currentUserId;
const popupImage = document.querySelector(".popup_type_image");
const imageElement = popupImage.querySelector(".popup__image");
const captionElement = popupImage.querySelector(".popup__caption");


// Обработчик удаления карточки
function handleDelete(cardElement, cardId) {
  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

// Обработчик лайка
function handleLike(likeButton, counter, item) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const action = isLiked ? removeLikeFromServer : addLikeToServer;

  action(item._id)
    .then((updatedCard) => {
      putLike(likeButton);
      counter.textContent = updatedCard.likes.length;
      item.likes = updatedCard.likes;
    })
    .catch((err) => {
      console.error("Ошибка при лайке:", err);
    });
}

// Обработчик открытия попапа с изображением
function handleImageClick(link, name) {
  openImagePopup(link, name);
}

closePopup(popups);

// Функция открытия попапа с изображением
function openImagePopup(link, name) {
  imageElement.src = link;
  imageElement.alt = name;
  captionElement.textContent = name;
  openModal(popupImage);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const saveButton = formNewCard.querySelector(".popup__button");
  const originalText = saveButton.textContent;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  const newCard = { name: placeNameInput.value, link: placeLinkInput.value };

  // Отправляем новую карточку на сервер
  addCardToServer(newCard)
    .then((card) => {
      const cardElement = createCard(
        card,
        (cardEl) => handleDelete(cardEl, card._id),
        handleLike,
        handleImageClick,
        currentUserId
      );
      placesList.prepend(cardElement);
      closeModal(popupAddCard);
      formNewCard.reset();
      clearValidation(formNewCard, validationConfig);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    });
}

formNewCard.addEventListener("submit", handleNewCardSubmit);

// Слушатели на кнопки

addButton.addEventListener("click", () => openModal(popupAddCard));

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEditCard);
});

buttonAvatar.addEventListener("click", () => openModal(popupAvatar));



window.addEventListener("load", () => {
  getUserProfile()
    .then((data) => {
      currentUserId = data._id;
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      buttonAvatar.style.backgroundImage = `url('${data.avatar}')`;

      return getInitialCards();
    })
    .then((cards) => {
      cards.forEach((item) => {
        const cardElement = createCard(
          item,
          handleDelete,
          handleLike,
          handleImageClick,
          currentUserId
        );
        placesList.append(cardElement);
      });
    })
    .catch((err) => {
      console.error("Ошибка при загрузке данных:", err);
    });
});

formEditAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const saveButton = formEditAvatar.querySelector(".popup__button");
  const originalText = saveButton.textContent;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  const newAvatarUrl = avatarInput.value;

  updateAvatar(newAvatarUrl)
    .then(() => {
      buttonAvatar.style.backgroundImage = `url('${newAvatarUrl}')`;
      formEditAvatar.reset();
      closeModal(popupAvatar);
      clearValidation(formEditAvatar, validationConfig);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    });
});

// Обработчик события отправки формы
formEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = nameInput.value;
  const about = jobInput.value;

  const saveButton = formEditProfile.querySelector(".popup__button");
  const originalText = saveButton.textContent;
  saveButton.textContent = "Сохранение...";
  saveButton.disabled = true;

  editProfile(name, about)
    .then(() => getUserProfile())
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(popupEditCard);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
      alert("Произошла ошибка при обновлении профиля: " + err.message);
    })
    .finally(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    });
});

// Конфиг для валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

enableValidation(validationConfig);


import { getClosestParentOf } from "../helpers";
/**
 * Adds navigation to HTML
 */
export const createTopMenu = () => {
  const markup = `<header class="header">
                        <nav class="header__nav">
                            <ul class="nav__left--list">
                            </ul>
                            <div class="nav__logo">Roomie</div>
                            <ul class="nav__right--list">
                            </ul>                        
                        </nav>
                    </header>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};

/**
 * Creates room category buttons on navigation
 * @param {array} rooms array with room objects
 */
export const initializeLeftMenu = rooms => {
  let markup = "";

  for (let i = 0; i < rooms.length; i++) {
    markup += createMarkupForMenuButtons(rooms[i].name, rooms[i].icon);
  }

  document
    .querySelector(".nav__left--list")
    .insertAdjacentHTML("afterbegin", markup);
};

/**
 * Creates option buttons on a right side of the navigation
 */
export const initializeRightMenu = optionsMenu => {
  let markup = "";
  for (let i = 0; i < optionsMenu.length; i++) {
    markup += createMarkupForMenuButtons(
      optionsMenu[i].name,
      optionsMenu[i].icon
    );
  }

  document
    .querySelector(".nav__right--list")
    .insertAdjacentHTML("afterbegin", markup);
};

/**
 * Creates menu button markup
 * @param {string} name name describing purpose of the button
 * @param {string} icon icon which will be displayed on button, this should be icon which could be applied using class of 'i' element
 * @returns markup string
 */
const createMarkupForMenuButtons = (name, icon) => {
  let markup = "";

  markup += `<li id="${name}" class="nav__list--item room__menu--item">
        <a href="#${name}">
            <i class="${icon}"></i>
        </a>
      </li>`;
  return markup;
};

/**
 * Creates markup for modal and adds it to html
 */
export const createModal = () => {
  const markup = `<div class="modal">
                        <div class="modal__container">
                            <div class="modal__title">
                                <h2 class="modal__heading"></h2>
                                <div class="closeButton">
                                    <i class="fas fa-times close_icon"></i>
                                </div>
                            </div>
                            <div class="modal__content">
                            </div>
                        </div>
                    </div>`;
  document.querySelector(".header").insertAdjacentHTML("afterend", markup);
};

/**
 * creates main markup
 */
export const createMain = () => {
  const markup = `<main class=main></main>`;
  document.querySelector(".modal").insertAdjacentHTML("afterend", markup);
};

/**
 * Creates side panel markup
 */
export const createSidePanel = () => {
  const markup = `<div class="side-panel">  
                    <div class="side-panel__content">
                      <div class="side-panel__title-bar">
                          <h2 class="side-panel__heading">
                             
                          </h2>
                          <div class="closeButton">
                              <i class="fas fa-times"></i>
                          </div>
                      </div>
                      <div class="side-panel__item-Box">
                      </div>
                  </div>
              </div>`;
  document.querySelector(".main").insertAdjacentHTML("afterbegin", markup);
};

export const clearSidePanel = () => {
  document.querySelector(".side-panel__heading").innerHTML = "";
  clearItemBox();
  const category = document.querySelector(".side-panel__category");
  if (category) {
    document.querySelector(".side-panel__content").removeChild(category);
  }
};

export const clearItemBox = () =>{ 
  document.querySelector(".side-panel__item-Box").innerHTML = "";
  
}

/**
 * Opens up Side Panel
 */
export const openSidePanel = () => {
  document.querySelector(".side-panel").style.transform = "translateX(0)";
};

export const changeTitleOfSidePanel = ButtonID => {
  const headingTitle = ButtonID.replace("_", " ");
  document.querySelector(".side-panel__heading").innerHTML = headingTitle;
};

export const createCategoryMenuInSidePanel = room => {
  // <span class="category__expand-button"></span>
  let markup = `<div class="side-panel__category">
                    <div class="category--heading">
                      <p>Categories</p>
                    </div>
                      <ul class="category__list">`;
  for (let i = 0; i < room.furnituresByCategory.length; i++) {
    markup += `<li class="category__list--item" data-category_name="${
      room.furnituresByCategory[i].category_name
    }">${room.furnituresByCategory[i].category_name}</li>`;
  }

  markup += ` </ul>
                  </div>`;

  document
    .querySelector(".side-panel__title-bar")
    .insertAdjacentHTML("afterend", markup);
};

export const toggleCategories = () => {
  document
    .querySelector(".category__list")
    .classList.toggle("category__list--active");
};

export const createItemMarkup = (items, itemType) => {
  let markup = '';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    markup += `<div class="item__field" id="item_${item.catalog_id}">
                      <div class='item__field__image--container'>
                        <img src="${item.thumb_img}" alt="${
      item.name
    }" draggable="false">
                      </div>
                      <div class="item__field--text">
                        <div class="item__field__title">${item.name}</div>`;
    if (itemType === "room")
      markup += ` <div class="item__field__price">$${item.price}</div>`;
    markup += `</div>
              </div>`;
  }
  document.querySelector(".side-panel__item-Box").insertAdjacentHTML('afterbegin',markup);
};

/**
 * Closes Side Panel
 */
export const closeSidePanel = () => {
  document.querySelector(".side-panel").style.transform = "translateX(-100%)";
  
};

/**
 * Creates modal content and fills it with proper data
 * @param {array} placedFurniture furniture that are placed in the room
 * @param {object} renovationTime objects that contains start and end date of a renovation
 * @param {number} totalPrice total price of furniture placed in the room
 */
export const createModalContentWithSummary = (
  placedFurniture,
  renovationTime,
  totalPrice
) => {
  let markup = "";
  openModal();

  document.querySelector(".modal__heading").innerHTML = "Summary";
  markup += `<div class="modal__content--container">
                        <table>
                            <tr>
                                <td class="renovation-time--label">Renovation Start:</td>
                                <td>${renovationTime.start}</td>
                            </tr>
                            <tr>
                                <td class="renovation-time--label">Renovation End:</td>
                                <td>${renovationTime.end}</td>
                            </tr> 
                        </table>
                `;
  if (placedFurniture.length > 0) {
    markup += "<table>";
    placedFurniture.forEach((item, index) => {
      markup += `<tr> 
                        <td class="summary__index--col">${index + 1}.</td>
                        <td class="summary__name--col">${item.name}</td>
                        <td class="summary__price--col">$${item.price}</td>
                </tr>`;
    });
    markup += `<tr class="summary__total-price--row">
                        <td></td>
                        <td>Total Price:</td>
                        <td class="summary__total-price--col">$${totalPrice}</td>
                </tr>`;
    markup += "</table>";
  } else {
    markup += `<p class="summary__paragraph">There is no furniture in your room.</p>`;
  }
  document
    .querySelector(".modal__content")
    .insertAdjacentHTML("afterbegin", markup);
};

/**
 * Fills in modal content with date inputs
 * @param {object} renovationTime objects that contains start and end date of a renovation
 */
export const createModalContentWithRenovationTimePrompt = renovationTime => {
  openModal();
  document.querySelector(".modal__heading").textContent = "Renovation Time";
  let markup = `<div class="input__container">
                    <div class="field__group">
                        <label for="dateStart">Start:</label> 
                        <input id='dateStart' type='date' value="${
                          renovationTime.start
                        }">
                    </div>`;

  markup += `<div class="field__group">
                    <label for="dateEnd">End:</label> 
                    <input id='dateEnd' type='date' value="${
                      renovationTime.end
                    }">
               </div>
            <button class="renovationtime__submit">Save</button>
      </div>`;

  document
    .querySelector(".modal__content")
    .insertAdjacentHTML("beforeend", markup);
};

/**
 * @returns array with start and end date of a renovation which were selected in a renovation time prompt modal
 */
export const getRenovationTime = () => {
  return [
    document.querySelector("#dateStart").value,
    document.querySelector("#dateEnd").value
  ];
};

/**
 * Opens modal after clicking on an adequate button
 */
const openModal = () =>
  (document.querySelector(".modal").style.display = "flex");

/**
 * Closes modal after clicking on a "X" button or a background and clears it
 *
 */
export const closeModal = () => {
  document.querySelector(".modal").style.display = "none";
  document.querySelector(".modal__content").innerHTML = "";
  document.querySelector(".modal__heading").innerHTML = "";
};

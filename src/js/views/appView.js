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
    let markup = ""
    for (let i = 0; i < optionsMenu.length; i++) {
        markup += createMarkupForMenuButtons(optionsMenu[i].name, optionsMenu[i].icon);
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

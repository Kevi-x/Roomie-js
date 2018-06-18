import * as appView from "./views/appView";
import * as roomView from "./views/roomView";
import Room from "./model/Room";
import Furniture from "./model/Furniture";
import * as helpers from "./helpers";

/**
 * Stores app data
 * @property {array} rooms array of room objects
 * @property {number} totalPrice Total price of placed furnitures
 * @property {array} placedFurniture Furnitures which are placed in room
 * @property {object} timespan Timespan of room renovation
 * @property {date} timespan.start start date of renovation
 * @property {date} timespan.end end date of renovation
 * @property {String} whichSideMenuIsOpened name of clicked button
 * @property {String} selectedCategory name of clicked categroy
 * @property {array} optionsMenu Array of objects with properties used for options (right) menu
 * @property {String} optionsMenu.name name of a button
 * @property {String} optionsMenu.icon icon of a button on options (right) menu in fontawesome convention
 * @property {array} optionsMenu.floors array of objects with floor properties
 * @property {number} optionsMenu.floors.catalog_id id of specific floor
 * @property {String} optionsMenu.floors.name name of a floor
 * @property {String} optionsMenu.floors.thumb_img image used in side menu
 * @property {String} optionsMenu.floors.img image of a floor
 */
const data = {
  rooms: [],
  totalPrice: 0,
  placedFurniture: [],
  renovationTime: {
    start: new Date().toJSON().slice(0, 10),
    end: new Date().toJSON().slice(0, 10)
  },
  whichSideMenuIsOpened: "",
  selectedCategory: "",
  optionsMenu: [
    {
      name: "Change_room",
      icon: "fas fa-cog",
      floors: [
        {
          catalog_id: 0,
          name: "Planks",
          thumb_img: "img/plank.jpg",
          img: "img/plank.jpg"
        },
        {
          catalog_id: 1,
          name: "Planks Dark",
          thumb_img: "img/floor4.jpg",
          img: "img/floor4.jpg"
        }
      ]
    },
    {
      name: "renovation_time",
      icon: "fas fa-clock"
    },
    {
      name: "summary",
      icon: "fas fa-list-ul"
    },
    {
      name: "clean_view",
      icon: "fas fa-trash"
    }
  ]
};

/**
 * Object with clicked html element properties (width, height), start position of this element, floor boundries
 */
let clickedObject = {};

window.addEventListener("load", () => {
  initialize();
});

/**
 * Initializes whole app
 */
const initialize = () => {
  initializeStyles();
  appView.createTopMenu();
  fetchAndInitializeLeftSideMenu();
  appView.initializeRightMenu(data.optionsMenu);
  appView.createModal();
  appView.createMain();
  appView.createSidePanel();
  roomView.createMainContent();
  setupEventListeners();
};

/**
 * Fetches data from external json file with data then it initializes rooms objects and then it initializes top room menu.
 *
 */
const fetchAndInitializeLeftSideMenu = () => {
  fetch("data/appData.json")
    .then(response => response.json())
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        data.rooms.push(
          new Room(
            helpers.getRandom(1, 9999999),
            json[i].name,
            json[i].icon,
            json[i].furnitureCategories
          )
        );
      }
      return data.rooms;
    })
    .then(rooms => {
      appView.initializeLeftMenu(rooms);
    })
    .catch(e => {
      console.log(e);
    });
};

/**
 * Setup event listeners
 */
const setupEventListeners = () => {
  let timeOutID;
  document
    .querySelector(".nav__left--list")
    .addEventListener("click", handleLeftSideMenuClick);
  document
    .querySelector(".nav__right--list")
    .addEventListener("click", handleRightSideMenuClick);
  document.querySelector(".modal").addEventListener("click", e => {
    if (e.target.matches(".modal, .closeButton, .closeButton *"))
      appView.closeModal();
  });
  document
    .querySelector(".side-panel__title-bar")
    .addEventListener("click", e => {
      if (e.target.matches(".closeButton, .closeButton *"))
        appView.closeSidePanel();
    });

  document
    .querySelector(".side-panel__item-Box")
    .addEventListener("click", handleItemFieldClick);
  document.querySelector(".floor").addEventListener("mousedown", initDragging);
  document.querySelector(".floor").addEventListener("mouseup", draggingStop);
  document.querySelector(".floor").addEventListener("mouseover", e => {
    roomView.stateIconShow(e);
    timeOutID = roomView.tooltipShow(e);
  });
  document.querySelector(".floor").addEventListener("mouseout", e => {
    roomView.stateIconHide(e);
    roomView.tooltipHide(e, timeOutID);
  });
  document.querySelector(".floor").addEventListener("click", stateIconsHandle);
};


/**
 * Handles Click event on left side menu, opens up side panel and fills up side panel with content
 * @param {object} e mouse event object
 */
const handleLeftSideMenuClick = e => {
  appView.clearSidePanel();
  appView.openSidePanel();
  const parentElement = helpers.getClosestParentOf(
    e.target,
    ".nav__list--item"
  );
  const room = getRoomOfSpecificName(parentElement.id);

  if (room !== null) {
    appView.createCategoryMenuInSidePanel(room);
    appView.changeTitleOfSidePanel(room.name);
    data.whichSideMenuIsOpened = room.name;
    document.querySelector(".category__list").addEventListener("click", e => {
      appView.clearItemBox();
      controlItemShowAfterClickingOnCategory(e, room);
    });
  }
  document
    .querySelector(".category--heading")
    .addEventListener("click", appView.toggleCategories);
};

/**
 * 
 * @param {string} id html element's id with name of a room
 * @returns {object} room
 */
const getRoomOfSpecificName = id => {
  let roomIndex = -1;
  for (let i = 0; i < data.rooms.length; i++) {
    if (id === data.rooms[i].name) {
      roomIndex = i;
    }
  }

  if (roomIndex == -1) {
    return null;
  } else {
    return data.rooms[roomIndex];
  }
};

/**
 * Shows item in clicked category
 * @param {object} e mouse event object 
 * @param {object} room  
 */
const controlItemShowAfterClickingOnCategory = (e, room) => {
  const categoryName = e.target.dataset.category_name;
  data.selectedCategory = categoryName;
  if (categoryName) {
    const furnitures = room.getFurnitures(categoryName);
    appView.createItemMarkup(furnitures, "room");
  }
};

/**
 * Handles Click event on right side menu
 * 
 * @param {object} e mouse event object
 */
const handleRightSideMenuClick = e => {
  const targetElement = e.target;

  if (targetElement.matches("#Change_room, #Change_room *")) {
    appView.clearSidePanel();
    appView.clearItemBox();
    appView.changeTitleOfSidePanel("Change Room");
    appView.createItemMarkup(data.optionsMenu[0].floors, "change_room");
    data.whichSideMenuIsOpened = "floor";
    appView.openSidePanel();
  } else if (targetElement.matches("#renovation_time, #renovation_time *")) {
    appView.createModalContentWithRenovationTimePrompt(data.renovationTime);
    document
      .querySelector(".renovationtime__submit")
      .addEventListener("click", e => {
        [
          data.renovationTime.start,
          data.renovationTime.end
        ] = appView.getRenovationTime();
        appView.closeModal();
      });
  } else if (targetElement.matches("#summary, #summary *")) {
    appView.createModalContentWithSummary(
      data.placedFurniture,
      data.renovationTime,
      data.totalPrice
    );
  } else if (targetElement.matches("#clean_view, #clean_view *")) {
    const confirmation = confirm(
      "Are you sure you want to delete furnitures from the room?"
    );
    if (confirmation && data.placedFurniture.length !== 0) {
      removePlacedFurniture();
    }
  }
};

/**
 * removes placed furniture
 */
const removePlacedFurniture = () => {
  data.placedFurniture.forEach(item => {
    const elemToRemove = document.querySelector(`#fur_${item.id}`);
    document.querySelector(".floor").removeChild(elemToRemove);
  });

  data.placedFurniture.splice(0, data.placedFurniture.length);
  data.totalPrice = 0;
};
/**
 * handles clicking on item in side panel
 * @param {object} e mouse event object
 */
const handleItemFieldClick = e => {
  const targetElement = e.target;
  if (targetElement.matches(".item__field, .item__field *")) {
    const catalog_id = helpers
      .getClosestParentOf(targetElement, ".item__field")
      .id.split("_")[1];
    if (data.whichSideMenuIsOpened === "floor") {
      const floorTexture = getFloorTextureById(catalog_id);
      roomView.changeFloor(floorTexture);
    } else {
      const furnitureObj = createFurnitureObject(catalog_id);
      roomView.renderFurnitureInRoom(furnitureObj);
      data.totalPrice += furnitureObj.price;
      data.placedFurniture.push(furnitureObj);
    }
  }
};

/**
 * creates Furniture object
 * @param {number} catalog_id id of clicked furniture
 * @returns {object} 
 */
const createFurnitureObject = catalog_id => {
  const room = getRoomOfSpecificName(data.whichSideMenuIsOpened);

  const furniture = room.getFurniture(data.selectedCategory, catalog_id);
  const furnitureObj = new Furniture(
    helpers.getRandom(0,99999),
    furniture.name,
    furniture.price,
    furniture.category,
    furniture.room,
    furniture.thumb_img,
    furniture.img_url
  );
  return furnitureObj;
};

/**
 * 
 * @param {number} id id of clicked floor
 * @returns {String} path of a floor texture 
 */
const getFloorTextureById = id => {
  const floors = data.optionsMenu[0].floors;
  for (let i = 0; i < floors.length; i++) {
    if (floors[i].catalog_id == id) {
      return floors[i].img;
    }
  }
};

/**
 * Initialize dragging of a furniture after clicking on it
 * @param {object} e mouse event object
 */
const initDragging = e => {
  if (e.target.matches(".furniture-image, .furniture-image *")) {
    const id = e.target.parentNode.parentNode.id.split("_")[1];
    clickedObject = helpers.getClickedObjectProps(e);
    e.target.parentNode.addEventListener("mousemove", handleDragging);
    e.preventDefault();
  }
};


/**
 * Handles mouse event on a furniture
 * @param {object} e mouse event object 
 */
const handleDragging = e => {
  const parentOfTarget = e.target.parentNode.parentNode;
  if (parentOfTarget.className === "furniture") {
    const mouseXPositionOffset = e.clientX - clickedObject.mouseClickXPosition;
    const mouseYPositionOffset = e.clientY - clickedObject.mouseClickYPosition;

    const objectXPosition = clickedObject.startElemPosX + mouseXPositionOffset;
    const objectYPosition = clickedObject.startElemPosY + mouseYPositionOffset;

    parentOfTarget.style.left =
      Math.max(0, Math.min(objectXPosition, clickedObject.maxBoundX)) + "px";

    parentOfTarget.style.top =
      Math.max(0, Math.min(objectYPosition, clickedObject.maxBoundY)) + "px";

  }
};

/**
 * Stops draging of a furniture
 * @param {object} event mouse event object
 */
const draggingStop = event => {
  if (event.target.parentNode.parentNode.className === "furniture") {
    event.target.parentNode.removeEventListener("mousemove", handleDragging);
    document
      .querySelector(".floor")
      .addEventListener("mousedown", initDragging);
  }
};

/**
 * Handles click event on a state icon of a furniture element
 * @param {object} e mouse event object
 */
const stateIconsHandle = e => {
  if (e.target.matches(".stateIcons, .stateIcons *")) {
    const furnitureElement = helpers.getClosestParentOf(e.target, ".furniture");
    let id = furnitureElement.id;
    const clickedObject = helpers.getClickedObjectProps(e);
    const furnitureObj = getPlacedFurniture(
      parseInt(id.split("_")[1])
    );
    if (e.target.matches("#removeFurnitureButton, #removeFurnitureButton *")) {
      
      removeFurnitureData(parseInt(id.split("_")[1]));
      roomView.removeFromView(e);
    } else if (e.target.matches("#rotateFurnitureIcon, #rotateFurnitureIcon *")) {
      

      roomView.rotate(e, furnitureObj, clickedObject);
    } else if (e.target.matches("#zoominFurnitureIcon, #zoominFurnitureIcon *")) {

      roomView.zoom(e, furnitureObj, "in");
    } else if (e.target.matches("#zoomoutFurnitureIcon, #zoomoutFurnitureIcon *")) {

      roomView.zoom(e, furnitureObj, "out");
    }
  }
};

/**
 * returns furniture object of a specific id
 * @param {number} id 
 * @returns {object}
 */
const getPlacedFurniture = id => {
  for (let i = 0; i < data.placedFurniture.length; i++) {
    if (data.placedFurniture[i].id === id) {
      return data.placedFurniture[i];
    }
  }
  return null;
};

/**
 * Removes furniture of a specific id
 * @param {number} id 
 */
const removeFurnitureData = id => {
  const furnitures = data.placedFurniture;
  let indexToRemove = -1;
  for (let i = 0; i < furnitures.length; i++) {
    if (furnitures[i].id === id) {
      indexToRemove = i;
      break;
    }
  }

if(indexToRemove !== -1){
  data.totalPrice -= furnitures[indexToRemove].price;
  furnitures.splice(indexToRemove, 1);
}
};

const initializeStyles = () => {
  
const css = '/* roboto-300 - latin */'+
'@font-face {'+
'  font-family: "Roboto";'+
'  font-style: normal;'+
'  font-weight: 300;'+
'  src: local("Roboto Light"), local("Roboto-Light"),'+
'    url("../css/roboto-v18-latin-300.woff2") format("woff2"),'+
'    /* Chrome 26, Opera 23, Firefox 39 */'+
'      url("../css/roboto-v18-latin-300.woff") format("woff"); /* Chrome 6, Firefox 3.6, IE 9, Safari 5.1 */'+
'}'+
'/* roboto-regular - latin */'+
'@font-face {'+
'  font-family: "Roboto";'+
'  font-style: normal;'+
'  font-weight: 400;'+
'  src: local("Roboto"), local("Roboto-Regular"),'+
'    url("../css/roboto-v18-latin-regular.woff2") format("woff2"),'+
'    /* Chrome 26+, Opera 23+, Firefox 39+ */'+
'      url("../css/roboto-v18-latin-regular.woff") format("woff"); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */'+
'}'+
'/* roboto-500 - latin */'+
'@font-face {'+
'  font-family: "Roboto";'+
'  font-style: normal;'+
'  font-weight: 500;'+
'  src: local("Roboto Medium"), local("Roboto-Medium"),'+
'    url("../css/roboto-v18-latin-500.woff2") format("woff2"),'+
'    /* Chrome 26+, Opera 23+, Firefox 39+ */'+
'      url("../css/roboto-v18-latin-500.woff") format("woff"); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */'+
'}'+
'/* roboto-700 - latin */'+
'@font-face {'+
'  font-family: "Roboto";'+
'  font-style: normal;'+
'  font-weight: 700;'+
'  src: local("Roboto Bold"), local("Roboto-Bold"),'+
'    url("../css/roboto-v18-latin-700.woff2") format("woff2"),'+
'    /* Chrome 26+, Opera 23+, Firefox 39+ */'+
'      url("../css/roboto-v18-latin-700.woff") format("woff"); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */'+
'}'+
'* {'+
'  margin: 0;'+
'  box-sizing: inherit;'+
'  font-family: "Roboto", serif;'+
'  -webkit-user-select: none;'+
'  -moz-user-select: none;'+
'  -ms-user-select: none;'+
'  user-select: none;'+
'  font-size: inherit;'+
'}'+
''+
'html {'+
'  overflow: hidden;'+
'  font-size: 62.5%;'+
'  box-sizing: border-box;'+
'}'+
''+
'body {'+
'  display: flex;'+
'  flex-direction: column;'+
'  height: 100vh;'+
'}'+
'/* ----------------------------------- Header ----------------------------------- */'+
''+
'.header {'+
'  height: 6rem;'+
'  background-color: #fff;'+
'  display: flex;'+
'  align-items: center;'+
'  /* box-shadow: 0px -5px 10px 1px rgba(0, 0, 0, 0.9); */'+
'  border-bottom: 1px solid #2f35424f;'+
'}'+
''+
'.header__nav {'+
'  width: 100%;'+
'  display: flex;'+
'  align-items: center;'+
'  align-self: stretch;'+
'  justify-content: space-around;'+
'}'+
''+
'.nav__logo {'+
'  font-size: 4rem;'+
'  text-transform: uppercase;'+
'  font-weight: 300;'+
'  letter-spacing: 8px;'+
'}'+
''+
'.nav__left--list,'+
'.nav__right--list {'+
'  display: flex;'+
'  justify-content: center;'+
'  align-self: center;'+
'  list-style: none;'+
'  align-self: stretch;'+
'  padding: 0;'+
'  margin: 0;'+
'}'+
''+
'.nav__list--item {'+
'  background-color: #fff;'+
'  display: flex;'+
'  align-items: center;'+
'  align-self: stretch;'+
'  transition: all 0.3s ease-in-out;'+
'}'+
''+
'.nav__list--item:not(:last-child) {'+
'  border-right: 1px solid #2f3542;'+
'}'+
''+
'.nav__list--item:hover {'+
'  background-color: #2f3542;'+
'  color: #ced6e0;'+
'}'+
''+
'.nav__list--item a:visited,'+
'.nav__list--item a:link {'+
'  text-decoration: none;'+
'  color: #2f3542;'+
'  padding: 0 1.2rem;'+
'  font-size: 3rem;'+
'  transition: all 0.3s ease-in-out;'+
'}'+
''+
'.nav__list--item:hover a {'+
'  color: #ced6e0;'+
'}'+
''+
'/* ------------------------------ MODAL -------------------- */'+
''+
'.modal {'+
'  display: none;'+
'  position: fixed;'+
'  z-index: 700;'+
'  border-top: 1px solid #2f3542;'+
'  left: 0;'+
'  top: 0;'+
'  width: 100%;'+
'  height: 100%;'+
'  background-color: rgb(0, 0, 0);'+
'  background-color: rgba(0, 0, 0, 0.4);'+
'  justify-content: center;'+
'  align-items: center;'+
'}'+
''+
'.modal__container {'+
'  display: flex;'+
'  background-color: #fefefe;'+
'  flex-direction: column;'+
''+
'  border: 1px solid #888;'+
'  width: 50%;'+
'  color: #2f3542;'+
'}'+
''+
'.modal__title {'+
'  border-bottom: 1px solid #2f3542;'+
'  height: 7.5rem;'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: space-between;'+
'  padding: 0 3rem;'+
'}'+
''+
'.modal__title h2 {'+
'  font-size: 3.5rem;'+
'}'+
''+
'.modal__title .closeButton {'+
'  width: 7.5rem;'+
'  height: 7.5rem;'+
'  font-size: 4.5rem;'+
'  cursor: pointer;'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: center;'+
'  transition: all 0.3s ease-in-out;'+
'}'+
'.modal__title .closeButton:hover {'+
'  background-color: #2f3542;'+
'  color: #ced6e0;'+
'}'+
''+
'.closeIcon {'+
'  cursor: pointer;'+
'}'+
''+
'.modal__content {'+
'  padding: 0 3rem;'+
'}'+
''+
'.renovation-time--label {'+
'  font-weight: bold;'+
'}'+
''+
'.modal__content--container {'+
'  padding: 2rem 0;'+
'  font-size: 2rem;'+
'}'+
''+
'.modal__content--container table {'+
'  width: 100%;'+
'  color: #2f3542;'+
'}'+
''+
'/* --------------- Summary ---------------- */'+
'.summary__index--col {'+
'  width: 5%;'+
'}'+
''+
'.summary__name--col {'+
'  width: 65%;'+
'}'+
''+
'.summary__price--col {'+
'  width: 30%;'+
'  font-weight: bold;'+
'}'+
''+
'.summary__total-price--row {'+
'  height: 65px;'+
'  font-size: 2.5rem;'+
'}'+
''+
'.summary__total-price--col {'+
'  width: 30%;'+
'  font-weight: bold;'+
'}'+
''+
'.summary__paragraph {'+
'  padding: 30px;'+
'  font-size: 25px;'+
'  color: #2f3542;'+
'}'+
''+
'/* --------------------- Renovation Time ------------------------ */'+
''+
'.input__container {'+
'  padding: 5rem 6.5rem;'+
'  font-size: 2.5rem;'+
'  display: flex;'+
'  justify-content: center;'+
'  align-items: center;'+
'  flex-direction: column;'+
'}'+
''+
'.field__group {'+
'  display: flex;'+
'  align-items: center;'+
'  width: 100%;'+
''+
'  margin-bottom: 2rem;'+
'}'+
'.field__group label {'+
'  flex: 0 0 20%;'+
'}'+
'.field__group input {'+
'  display: flex;'+
'  flex: 0 0 80%;'+
'}'+
''+
'.renovationtime__submit {'+
'  margin-top: 3rem;'+
'  border: 1px solid #2e2e2e;'+
'  outline: none;'+
'  background-color: #fff;'+
'  padding: 1.5rem 4rem;'+
'  font-size: 2rem;'+
'  transition: all 0.4s ease-in-out;'+
'  color: #2f3542;'+
'  align-self: flex-start;'+
'}'+
''+
'.renovationtime__submit:hover {'+
'  color: #ced6e0;'+
'  background-color: #2f3542;'+
'}'+
''+
'/* ---------------------- MAIN ---------------------------- */'+
'.main {'+
'  display: flex;'+
'  height: 100%;'+
'}'+
''+
'/* ------------------- SIDE PANEL --------------------- */'+
''+
'.side-panel {'+
'  display: flex;'+
'  position: absolute;'+
'  z-index: 500;'+
'  flex-direction: column;'+
'  background-color: #fff;'+
'  width: 30rem;'+
'  height: 100%;'+
'  transform: translateX(-100%);'+
'  transition: all 0.3s ease-in;'+
'  box-shadow: -5px 5px 10px 1px rgba(0, 0, 0, 0.9);'+
'}'+
'.side-panel-active {'+
'  transform: translateX(0);'+
'}'+
'.side-panel__content {'+
'  display: flex;'+
'  flex-direction: column;'+
'}'+
''+
'.side-panel__title-bar {'+
'  padding-left: 1.5rem;'+
'  border-bottom: 1px solid #a4b0be;'+
''+
'  display: flex;'+
'  align-items: center;'+
'  flex: 0 0 auto;'+
'}'+
''+
'.side-panel__heading {'+
'  padding-top: 1rem;'+
'  padding-bottom: 1rem;'+
'  margin-right: auto;'+
'  font-size: 2.5rem;'+
'}'+
''+
'.side-panel__title-bar .closeButton {'+
'  padding: 0 1rem;'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: center;'+
'  font-size: 3rem;'+
'  align-self: stretch;'+
'  transition: all 0.3s ease-in-out;'+
'  cursor: pointer;'+
'}'+
''+
'.side-panel__title-bar .closeButton:hover {'+
'  background-color: #2f3542;'+
'  color: #ced6e0;'+
'}'+
''+
'/* ------------ Category ----------- */'+
''+
'.side-panel__category {'+
'  overflow: hidden;'+
'  flex: 0 0 auto;'+
'}'+
''+
'.category--heading {'+
'  font-size: 2.3rem;'+
'  padding-top: 1rem;'+
'  padding-bottom: 1rem;'+
'  padding-left: 1.5rem;'+
'  padding-right: 1rem;'+
'  display: flex;'+
'  position: relative;'+
'  z-index: 2;'+
'}'+
''+
'.category--heading p {'+
'  margin-right: auto;'+
'}'+
''+
'.category__expand-button {'+
'  position: absolute;'+
'  height: 2.7rem;'+
'  width: 0.5rem;'+
'  background-color: #2f3542;'+
'  right: 1.8rem;'+
'}'+
''+
'.category__expand-button::before {'+
'  content: "";'+
'  height: 2.7rem;'+
'  width: 0.5rem;'+
'  background-color: #2f3542;'+
'  right: 1.8rem;'+
'  transform: rotate(-90deg);'+
'}'+
''+
'ul.category__list--active {'+
'  max-height: 30rem;'+
'}'+
''+
'.category__list {'+
'  background-color: #2d3436;'+
'  transition: all 0.2s ease-in-out;'+
'  color: #fff;'+
'  list-style: none;'+
'  padding: 0;'+
'  max-height: 0;'+
'}'+
''+
'.category__list--item {'+
'  padding: 1rem 0rem 1rem 1.5rem;'+
'  font-family: inherit;'+
'  font-size: 1.8rem;'+
'  transition: all 0.2s;'+
'  font-weight: 300;'+
'}'+
''+
'.category__list--item {'+
'  border-bottom: 1px solid #fff;'+
'}'+
''+
'.category__list--item:hover {'+
'  color: #2d3436;'+
'  background-color: #fff;'+
'  border-bottom: 1px solid #2d3436;'+
'}'+
''+
'/* --------------------- ITEM BOX ----------------------- */'+
'.side-panel__item-Box {'+
'  display: flex;'+
'  flex-wrap: wrap;'+
'  justify-content: space-around;'+
'  overflow-y: auto;'+
'  overflow-x: hidden;'+
'  padding: 1rem 0;'+
'}'+
''+
'.item__field {'+
'  display: flex;'+
'  flex-direction: column;'+
'  justify-content: space-evenly;'+
'  align-items: center;'+
'  flex: 0 0 40%;'+
'  padding-right: 1rem;'+
'}'+
'.item_field:nth-child(odd) {'+
'  border-right: 1px solid #2d3436;'+
'}'+
'.item__field img {'+
'  width: 100%;'+
'}'+
''+
'.item__field--text {'+
'  font-size: 1.8rem;'+
'}'+
''+
'.item__field__title {'+
'  text-align: center;'+
''+
'  font-weight: 300;'+
'}'+
'.item__field__price {'+
'  text-align: center;'+
'}'+
''+
'/* ----------------------------- MAIN CONTENT ------------------------- */'+
''+
'.main-content {'+
'  /* flex: 3 0 auto; */'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: center;'+
'  width: 100%;'+
'  background-image: url(../img/bg2.jpg);'+
'}'+
''+
'.room {'+
'  display: flex;'+
'  justify-content: center;'+
'  align-items: center;'+
'  background-color: #b2bec3;'+
'  height: 55rem;'+
'  width: 70rem;'+
'  background: url("/img/wall.jpg");'+
'  background-size: 100% 100%;'+
'}'+
''+
'.floor {'+
'  height: 95%;'+
'  width: 95%;'+
'  background: url("/img/floor4.jpg");'+
'  background-size: 100% 100%;'+
'  box-shadow: inset 0px 0px 10px 4px rgba(0, 0, 0, 0.75);'+
'  position: relative;'+
'}'+
''+
'/* ---------------------- FURNITURE ------------------------ */'+
''+
'.furniture {'+
'  position: absolute;'+
'  left: 20px;'+
'  top: 20px;'+
'  height: 100px;'+
'}'+
'.furniture-image {'+
' height:100px;'+
' position: relative;'+
'}'+
''+
'.furniture-image img {'+
'  position: relative;'+
'  top:0;'+
'  height: 100%;'+
'}'+
'.stateIcons {'+
'  position: absolute;'+
'  cursor: pointer;'+
''+
'  position: absolute;'+
'  color: #bfccdb;'+
'  transform: translateX(-100%);'+
'  top: 0px;'+
'  visibility: hidden;'+
'}'+
'.stateIcon {'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: center;'+
'  padding: 1rem 1rem;'+
'  background-color: #2e2e2e;'+
''+
'  text-align: center;'+
'  font-size: 15px;'+
'}'+
'.stateIcon:hover {'+
'  background-color: #000;'+
'}'+
''+
'.tooltip {'+
'  background-color: #2e2e2e;'+
'  color: #bfccdb;'+
'  text-align: center;'+
'  width: 25rem;'+
'  padding: 2rem 1.3rem;'+
'  position: absolute;'+
'  background: #2e2e2e;'+
'  cursor: initial;'+
'  display: flex;'+
'  align-items: center;'+
'  justify-content: center;'+
'  visibility: hidden; '+
'  left: 3rem;'+
'  top: 100%;'+
'  font-size: 2rem;'+
'}'+
'.tooltip:after,'+
'.tooltip:before {'+
'  bottom: 100%;'+
'  left: 30%;'+
'  border: solid transparent;'+
'  content: "";'+
'  height: 0;'+
'  width: 0;'+
'  position: absolute;'+
'  pointer-events: none;'+
'  cursor: initial;'+
'}'+
''+
'.tooltip:after {'+
'  border-color: rgba(46, 46, 46, 0);'+
'  border-bottom-color: #2e2e2e;'+
'  border-width: 17px;'+
'  margin-left: -60px;'+
'}'+
''+
'.tooltip:before {'+
'  border-color: rgba(0, 0, 0, 0);'+
'  border-width: 17px;'+
'  margin-left: -36px;'+
'}',
	
head = document.head || document.getElementsByTagName("head")[0],
style = document.createElement("style");

style.type = "text/css";
if (style.styleSheet) {
style.styleSheet.cssText = css;
} else {
style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
}
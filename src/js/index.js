import * as appView from "./views/appView";
import Room from "./model/Room";
import * as helpers from "./helpers";

/**
 * Stores app data
 * @property {array} roomData Data fetched from JSON file
 * @property {array} roomData.roomName array of furniture categories of specific room
 * @property {array} roomData.roomName.categoryName array of furnitures of specific category
 * @property {number} totalPrice Total price of placed furnitures
 * @property {array} placedFurniture Furnitures which are placed in room
 * @property {object} timespan Timespan of room renovation
 * @property {date} timespan.start start date of renovation
 * @property {date} timespan.end end date of renovation
 */
const data = {
  rooms: [],
  totalPrice: 0,
  placedFurniture: [],
  renovationTime: {
    start: new Date().toJSON().slice(0, 10),
    end: new Date().toJSON().slice(0, 10)
  },
  optionsMenu: [
    {
      name: "change_room",
      icon: "fas fa-clock"
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

window.addEventListener("load", () => {
  initialize();
});

/**
 * Initializes whole app
 */
const initialize = () => {
  appView.createTopMenu();
  fetchAndInitializeLeftSideMenu();
  appView.initializeRightMenu(data.optionsMenu);
  appView.createModal();
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
};

const handleLeftSideMenuClick = e => {
  
};

const handleRightSideMenuClick = e => {
  const targetElement = e.target;

  if (targetElement.matches("#change_room, #change_room *")) {
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
    const confirmation = confirm("Are you sure you want delete furnitures from the room?");
    if (confirmation && data.placedFurniture.length !== 0){
      // removePlacedFurniture();
    }
  }
};

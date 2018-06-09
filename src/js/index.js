// import * as mainView from "./views/mainView";
// import * as roomView from "./views/roomView";
// import { elements } from "./views/base";
// import Furniture from "./models/Furniture";
// import Room from "./models/Room";
// import {
//   getClosest,
//   getChild,
//   validateBoundaries,
//   getDraggableObjectProps
// } from "./helpers";

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
  timespan: {
    start: new Date().toJSON().slice(0, 10),
    end: new Date().toJSON().slice(0, 10)
  },
  optionsMenu:[
    {
      name: "Zmień_pokój",
      icon: "fas fa-clock"
    },
    {
      name: "Czas_remontu",
      icon: "fas fa-clock"
    },
    {
      name: "Podsumowanie",
      icon: "fas fa-list-ul"
    },
    {
      name: "Czyszczenie_widoku",
      icon: "fas fa-trash"
    },
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
    for(let i = 0; i < json.length;i++){
      data.rooms.push(new Room(helpers.getRandom(1,9999999),json[i].name,json[i].icon, json[i].furnitureCategories))
    }
    return data.rooms;
    }).then(rooms=>{
      appView.initializeLeftMenu(rooms);
    }).catch(e=>{
      console.log(e);
    });
};

/**
 * Setup event listeners
 */
const setupEventListeners = () => {
  document.querySelector(".nav__left--list").addEventListener('click', handleLeftSideMenuClick);
}

const handleLeftSideMenuClick = (e=>{

});





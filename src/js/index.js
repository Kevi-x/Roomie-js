import * as appView from "./views/appView";
import * as roomView from "./views/roomView";
import Room from "./model/Room";
import Furniture from "./model/Furniture";
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
  whichSideMenuIsOpened: "",
  selectedCategory: "",
  optionsMenu: [
    {
      name: "Change_room",
      icon: "fas fa-cog",
      floors: [
        {
          catalog_id: 0,
          name: "panele",
          thumb_img: "img/floor1.jpg",
          img: "img/floor1.jpg"
        },
        {
          catalog_id: 1,
          name: "panele2",
          thumb_img: "img/planks-2.jpg",
          img: "img/planks-2.jpg"
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
};

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

const controlItemShowAfterClickingOnCategory = (e, room) => {
  const categoryName = e.target.dataset.category_name;
  data.selectedCategory = categoryName;
  if (categoryName) {
    const furnitures = room.getFurnitures(categoryName);
    appView.createItemMarkup(furnitures, "room");
  }
};

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
      // removePlacedFurniture();
    }
  }
};

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

const createFurnitureObject = catalog_id => {
  const room = getRoomOfSpecificName(data.whichSideMenuIsOpened);

  const furniture = room.getFurniture(data.selectedCategory, catalog_id);
  const furnitureObj = new Furniture(
    furniture.catalog_id,
    furniture.name,
    furniture.price,
    furniture.category,
    furniture.room,
    furniture.thumb_img,
    furniture.img_url
  );
  return furnitureObj;
};

const getFloorTextureById = id => {
  const floors = data.optionsMenu[0].floors;
  for (let i = 0; i < floors.length; i++) {
    if (floors[i].catalog_id == id) {
      return floors[i].img;
    }
  }
};

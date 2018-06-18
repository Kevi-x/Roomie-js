import * as helpers from "../helpers";
/**
 * Creates main content markup
 */
export const createMainContent = () => {
  const markup = `<div class="main-content">
                        <div class="room">
                            <div class="floor">
                            </div>
                        </div>
                    </div>`;

  document.querySelector(".main").insertAdjacentHTML("beforeend", markup);
};

/**
 * Changes floor texture after clicking it on a side panel
 * @param {string} floorTexture path of a floor texture
 */
export const changeFloor = floorTexture => {
  document.querySelector(".floor").style.background = `url(${floorTexture})`;
  document.querySelector(".floor").style.backgroundSize= "100% 100%";
};

/**
 * Adds furniture element to a room view
 * @param {object} furniture 
 */
export const renderFurnitureInRoom = furniture => {
  const markup = `<div id="fur_${
    furniture.id
  }" class="furniture" data-category="${furniture.category}" data-room="${
    furniture.room
  }"> 
        <div class='stateIcons'> 
            <div id='removeFurnitureButton' class="stateIcon"><i class="fas fa-trash"></i></div> 
            <div id='rotateFurnitureIcon' class="stateIcon"> <i class="fas fa-share"></i></div>
            <div id='zoominFurnitureIcon' class="stateIcon"> <i class="fas fa-search-plus"></i></div>
            <div id='zoomoutFurnitureIcon' class="stateIcon"> <i class="fas fa-search-minus"></i></div> 
        </div>
        <div class="furniture-image">
        <img src=${furniture.img_url} alt="${
    furniture.name
  }"  draggable="false" class="img"> 
      </div>
        <div class='tooltip'> <span>${furniture.name}: ${
    furniture.price
  }zł </span></div>
       
        </div>`;
  document.querySelector(".floor").insertAdjacentHTML("beforeend", markup);
};

/**
 * Shows state icons after hovering over a furniture
 * @param {object} e mouse event object
 */
export const stateIconShow = e => {
  if (e.target.matches(".img, .stateIcon, .stateIcon *")) {
    const parent = helpers.getClosestParentOf(e.target, ".furniture");

    const stateIcons = helpers.getChildElementOf(parent, "stateIcons");

    stateIcons.style.visibility = "visible";
  }
};

/**
 * Hides state icons
 * @param {object} e mouse event object
 */
export const stateIconHide = e => {
  if (e.target.matches(".img,.stateIcon, .stateIcon *")) {
    const parent = helpers.getClosestParentOf(e.target, ".furniture");

    const stateIcons = helpers.getChildElementOf(parent, "stateIcons");

    stateIcons.style.visibility = "hidden";
  }
};

/**
 * Shows tooltip after 0.5s of hovering over a furniture
 * @param {object} e mouse event object
 */
export const tooltipShow = e => {
  if (e.target.matches(".img")) {
    const timeOutID = setTimeout(() => {
      const parent = helpers.getClosestParentOf(e.target, ".furniture");
      const tooltip = helpers.getChildElementOf(parent, "tooltip");
      tooltip.style.visibility = "visible";
    }, 500);
    return timeOutID;
  }
};

/**
 * Hides tooltip 
 * @param {object} e mouse event object
 * @param {Number} timeOutID 
 */
export const tooltipHide = (e, timeOutID) => {
  if (e.target.matches(".img")) {
    const parent = helpers.getClosestParentOf(e.target, ".furniture");
    const tooltip = helpers.getChildElementOf(parent, "tooltip");
    clearTimeout(timeOutID);
    tooltip.style.visibility = "hidden";
  }
};

/**
 * Removes furniture element
 * @param {object} e mouse event object 
 */
export const removeFromView = e => {
  const elementToRemove = helpers.getClosestParentOf(e.target, ".furniture");
  document.querySelector(".floor").removeChild(elementToRemove);
};

/**
 * Rotates a furniture
 * @param {object} e mouse event object 
 * @param {object} furnitureObj 
 */
export const rotate = (e, furnitureObj) => {
  const parent = helpers.getClosestParentOf(e.target, ".furniture");
  const clickedImageContainer = helpers.getChildElementOf(
    parent,
    "furniture-image"
  );
  const clickedImage = helpers.getChildElementOf(clickedImageContainer, "img");

  changeFurnitureObjOrientation(furnitureObj);

  clickedImageContainer.style.transform = `rotate(${furnitureObj.orientation *
    90}deg)`;
  const width = parseInt(
    window.getComputedStyle(clickedImage, null).getPropertyValue("height")
  );
  const height = parseInt(
    window.getComputedStyle(clickedImage, null).getPropertyValue("width")
  );
  if (furnitureObj.orientation === 1 || furnitureObj.orientation === 3) {
    if (furnitureObj.orientation === 3) {
     
      clickedImageContainer.style.top = `100%`;
      clickedImageContainer.style.transform = `rotate(${furnitureObj.orientation *
        90}deg) translateX(100%)`;
    }
    parent.style.height = height + "px";
    parent.style.width = width + "px";
  } else {
    clickedImageContainer.style.top = `0%`;
    clickedImageContainer.style.transform = `rotate(${furnitureObj.orientation *
      90}deg) translateX(0%)`;
    parent.style.height = width + "px";
    parent.style.width = height + "px";
  }
  const clickedObject = helpers.getClickedObjectProps(e);

  parent.style.left =
  Math.max(0, Math.min( parseInt(parent.style.left), clickedObject.maxBoundX)) + "px";

  parent.style.top =  
  Math.max(0, Math.min(parseInt(parent.style.top), clickedObject.maxBoundY)) + "px";

};



/**
 * Changes orientation property in an object
 * @param {object} furnitureObj 
 */
const changeFurnitureObjOrientation = furnitureObj => {
  furnitureObj.orientation += 1;
  if (furnitureObj.orientation === 4) furnitureObj.orientation = 0;
};

/**
 * Changes size of a furniture
 * @param {object} e mouse event object 
 * @param {object} obj 
 * @param {string} type in / out
 */
export const zoom = (e, obj, type) => {
  const parent = helpers.getClosestParentOf(e.target, ".furniture");
  const clickedImageContainer = helpers.getChildElementOf(
    parent,
    "furniture-image"
  );
  const clickedImage = helpers.getChildElementOf(clickedImageContainer, "img");
  let height;
  let width;
  const step = 10;
  if (obj.orientation === 1 || obj.orientation === 3) {
    width = clickedImage.offsetHeight;
    height = clickedImage.offsetWidth;
  } else {
    height = clickedImage.offsetHeight;
    width = clickedImage.offsetWidth;
  }
const clickedObject = helpers.getClickedObjectProps(e);
  if (type === "in") {
    if((height + step) < clickedObject.maxBoundY)
    height += step;
    if((width + step) < clickedObject.maxBoundX)
    width += step;
  } else if (type === "out") {
    height -= step;
    width -= step;
  }
 
  if (obj.orientation === 1 || obj.orientation === 3) {
    clickedImageContainer.style.height = width + "px";
    width = parseInt(
      window.getComputedStyle(clickedImage, null).getPropertyValue("height")
    );
    height = parseInt(
      window.getComputedStyle(clickedImage, null).getPropertyValue("width")
    );

  } else {
    clickedImageContainer.style.height = height + "px";
    width = parseInt(
      window.getComputedStyle(clickedImage, null).getPropertyValue("width")
    );
    height = parseInt(
      window.getComputedStyle(clickedImage, null).getPropertyValue("height")
    );
  }

  parent.style.height = height + "px";
  parent.style.width = width + "px";
 

  parent.style.left =
  Math.max(0, Math.min( parseInt(parent.style.left), clickedObject.maxBoundX)) + "px";

  parent.style.top =  
  Math.max(0, Math.min(parseInt(parent.style.top), clickedObject.maxBoundY)) + "px";
};

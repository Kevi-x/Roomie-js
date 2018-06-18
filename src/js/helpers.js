/**
 *
 * @param {number} min lower boundry of the range
 * @param {number} max upper boundry of the range
 * @returns random number whitin the range
 */
export const getRandom = (min, max) =>{
return Math.floor(Math.random() * (max - min) + min);
}
/**
 * Returns parent element with a specific selector and which has childElement
 * @param {Node} childElement child element of searched parent
 * @param {String} selector selector of searched parent
 */
export const getClosestParentOf = (childElement, selector) => {
  for (
    ;
    childElement && childElement !== document;
    childElement = childElement.parentNode
  ) {
    if (childElement.matches(selector)) return childElement;
  }
  return null;
};

/**
 * Returns child node with e specific selector and which has parent
 * @param {Node} parent parent of searched child
 * @param {String} selector selector of searched child
 */
export const getChildElementOf = (parent, selector) => {
  let child = null;

  for (let i = 0; i < parent.childNodes.length; i++) {
    if (typeof parent.childNodes[i].classList !== "undefined")
      if (parent.childNodes[i].classList.contains(selector)) {
        child = parent.childNodes[i];
        break;
      }
  }
  return child;
};

export const validateBoundaries = (
  objectXPosition,
  objectYPosition,
  draggableObject
) => {
  return [
    Math.max(
      draggableObject.minBoundX,
      Math.min(objectXPosition, draggableObject.maxBoundX)
    ) + "px",
    Math.max(
      draggableObject.minBoundY,
      Math.min(objectYPosition, draggableObject.maxBoundY)
    ) + "px"
  ];
};


/**
 * Returns object with properties of clicked element (width, height), position of this element as well as boundries of a floor
 * @param {object} e mouse event object
 */
export const getClickedObjectProps = e => {
  let obj = {};
  obj.clickedElement = getClosestParentOf(e.target, ".furniture");
  obj.clickedElementImageContainer = e.target.parentNode;
  const floor = document.querySelector(".floor");

  obj.minBoundX = floor.offsetLeft;
  obj.minBoundY = floor.offsetTop;

  obj.width = parseInt(
    window.getComputedStyle(obj.clickedElement, null).getPropertyValue("width")
  );
  obj.height = parseInt(
    window.getComputedStyle(obj.clickedElement, null).getPropertyValue("height")
  );

  obj.maxBoundX = floor.offsetWidth - obj.width;
  obj.maxBoundY = floor.offsetHeight - obj.height-10;

  obj.mouseClickXPosition = e.clientX;
  obj.mouseClickYPosition = e.clientY;

  obj.startElemPosX = e.target.parentNode.parentNode.offsetLeft;
  obj.startElemPosY = e.target.parentNode.parentNode.offsetTop;

  return obj;
};
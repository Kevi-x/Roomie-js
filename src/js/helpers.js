/**
 *
 * @param {number} min lower boundry of the range
 * @param {number} max upper boundry of the range
 * @returns random number whitin the range
 */
export const getRandom = (min, max) =>
  Math.floor(Math.round() * (max - min) + min);

export const getClosestParentOf = (childElement, selector) => {
  for (; childElement && childElement !== document; childElement = childElement.parentNode) {
    if (childElement.matches(selector)) return childElement;
  }
  return null;
};

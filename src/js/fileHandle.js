/**
 * Getting data from json file
 * @param {} callback callback function
 */
export const loadJSON = () => {
  return new Promise((resolve, reject) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "data/furnitures.json", true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        resolve(xobj.responseText);
      }else {
          reject("There Was some error");
      }
    };
    xobj.send(null);
  });
};

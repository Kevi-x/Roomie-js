export const createMainContent = () => {
  const markup = `<div class="main-content">
                        <div class="room">
                            <div class="floor">
                            </div>
                        </div>
                    </div>`;

  document.querySelector(".main").insertAdjacentHTML("beforeend", markup);
};

export const changeFloor = floorTexture => {
  document.querySelector(".floor").style.background = `url(${floorTexture})`;
};

export const renderFurnitureInRoom = furniture =>{
    const markup = `<div id="fur_${
        furniture.id
      }" class="furniture" data-category="${
        furniture.category
      }" data-room="${furniture.room}"> 
        <div class='stateIcons'> 
            <div id='removeFurnitureButton' class="stateIcon"><i class="fas fa-trash"></i></div> 
            <div id='rotateFurnitureIcon' class="stateIcon"> <i class="fas fa-share"></i></div>
            <div id='zoominFurnitureIcon' class="stateIcon"> <i class="fas fa-search-plus"></i></div>
            <div id='zoomoutFurnitureIcon' class="stateIcon"> <i class="fas fa-search-minus"></i></div> 
        </div>
        <div class="furniture-image">
        <img src=${furniture.img_url} alt="${
        furniture.name
      }"  draggable="false"> 
      </div>
        <div class='tooltip'> <span>${furniture.name}: ${
        furniture.price
      }zł </span></div>
       
        </div>`;
        document.querySelector('.floor').insertAdjacentHTML("beforeend", markup);
}
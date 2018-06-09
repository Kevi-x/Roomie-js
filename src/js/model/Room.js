export default class Room {
    constructor(id, name, icon, furnituresByCaterogy){
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.furnituresByCaterogy = furnituresByCaterogy;
    }

    getFurnitures(furnitures){
        this.furnitures = [];
        for (let i = 0; i < array.length; i++) {
            this.furnitures = array[i];
        }
    }
}
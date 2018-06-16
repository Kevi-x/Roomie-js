export default class Room {
    constructor(id, name, icon, furnituresByCategory){
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.furnituresByCategory = furnituresByCategory;
    }

    getFurnitures(categoryName){
        
        
        let categoryIndex = -1;
        for(let i = 0; i < this.furnituresByCategory.length; i++){
          if(categoryName === this.furnituresByCategory[i].category_name){
            categoryIndex = i;
          }
        }
      
        if(categoryIndex == -1){
          return null;
        }else{
          return this.furnituresByCategory[categoryIndex].furnitures;
        }
      
        
    }
    getCategoriesNames(){
        this.categoriesName = [];
        for (let i = 0; i < furnituresByCategory.length; i++) {
            categoriesName.push(furnituresByCategory[i].category_name);
        }
        return this.categoriesName;
    }
}

[{

},
{

}
]
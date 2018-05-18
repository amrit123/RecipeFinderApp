import axios from 'axios';


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const key="6dbf9fec7ad839d5ce59d19ea338f956";
        const proxyCors="https://cors-anywhere.herokuapp.com/";
        try {
            const resultData = await axios(`${proxyCors}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = resultData.data.recipe.title;
            this.author = resultData.data.recipe.publisher;
            this.img = resultData.data.recipe.image_url;
            this.url = resultData.data.recipe.source_url;
            this.ingredients = resultData.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numOfIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        

   
}
}
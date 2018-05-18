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
        const units=[...unitsShort,"kg","g"];
        
        const parsedIngredients=this.ingredients.map((el)=>{
            //uniform units
             let ingredient=el.toLowerCase();
             
             unitsLong.forEach((unit,i)=>{
                ingredient= ingredient.replace(unit,unitsShort[i]);
               
             }) 
             
            //remove parenthesis
            ingredient=ingredient.replace(/ *\([^)]*\) */g, " ");
           // console.log(ingredient);
            
            //parse ingredients into count,unit and ingredients
            const arrayIngredients=ingredient.split(" ");
           
           const unitIndex = arrayIngredients.findIndex(el2 => units.includes(el2));
      
            let objIng;
            if(unitIndex>-1){
                
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrayIngredients.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrayIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count:count,
                    unit: arrayIngredients[unitIndex],
                    ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
                };

            }else if(parseInt(arrayIngredients[0],10)){
                //there is no unit but ist digit is number
                objIng={
                    count:parseInt(arrayIngredients[0],10),
                    unit:"",
                    ingredient:arrayIngredients.slice(1).join(" ")
                }
            }
            else if(unitIndex===-1){
                //there is no unit and no number in ist position
                objIng={
                    count:1,
                    unit:"",
                    ingredient:ingredient
                }
            }
            //console.log(arrayIngredients);
            
          
            return objIng;


        });
this.ingredients=parsedIngredients;
   
}
}
import axios from "axios";
export default class Search{
    constructor(query){
        this.query=query;
    }
   
    async getRecipe(){
        const key="6dbf9fec7ad839d5ce59d19ea338f956";
        const proxyCors="https://cors-anywhere.herokuapp.com/";
        try{
            const resultData= await axios(`${proxyCors}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result= resultData.data.recipes;
           
        }
        catch(err){
            alert(err);
        }
        
    }
}


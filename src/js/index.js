// Global app controller
import Search from "./models/Search";
import {elements} from "./views/domStore";
import * as searchView from "./views/searchView";
/*
global state of the app
-search object
-current recepie object
-shopping list object
-liked recipe 
 */
const state={

}
const controlSearch=async ()=>{
    //get query from search
const query=searchView.getInput();
if(query){
    //create new search object and add to the state
    state.search=new Search(query);
    //prepare UI for results
    searchView.clearInput();
    searchView.clearList();
    //search for recipe
    await state.search.getRecipe();
}
    //display the result
    searchView.displayRecipe(state.search.result);
}

elements.searchButton.addEventListener("submit",(e)=>{
e.preventDefault();
controlSearch();
})
document.addEventListener("keypress",(e) =>{
    if (event.keyCode === 13 || event.which === 13) {
        e.preventDefault();
        controlSearch();
    }
})


//search.getRecipe();
//6dbf9fec7ad839d5ce59d19ea338f956
//http://food2fork.com/api/search
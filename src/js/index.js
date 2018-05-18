// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import {elements,renderLoader,clearLoader} from "./views/domStore";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
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
    renderLoader(elements.searchResult);
    //search for recipe
    try{
        await state.search.getRecipe();
        //display the result
        clearLoader();
        searchView.displayRecipeList(state.search.result);
    }
    catch(err){
        alert("problem loading serches!!!");
    }
  
}
    
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

elements.searchResultPagination.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearList();
        searchView.displayRecipeList(state.search.result, goToPage);
    }
});

/* 
Recipe controller
*/
const controlRecipe=async ()=>{
    const id = window.location.hash.replace('#', '');
    if(id){
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search)searchView.highlightSelected(id);
state.recipe = new Recipe(id);
console.log("get recipe");

    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    state.recipe.calcTime();
    state.recipe.calcServings();
    clearLoader();
    
    recipeView.displayIngredients(state.recipe);
    console.log(state.recipe);
   
   
 

    }

}
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//ebent to increase or decrese serving
elements.recipe.addEventListener("click",e=>{

if(e.target.matches(".btn-decrease,.btn-decrease *")) //btn_decrease* means any target that is child of btn-decrease

{
if(state.recipe.servings>1){
    
    state.recipe.updateServing("decreasing");
    recipeView.updateServingIngredients(state.recipe);
}
   
}
if(e.target.matches(".btn-increase,.btn-increase *")){
    
    state.recipe.updateServing("increasing");
    recipeView.updateServingIngredients(state.recipe);
}
console.log( state.recipe);
})
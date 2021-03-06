// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import Shoppinglist from "./models/Shoppinglist";
import Likes from "./models/Likes";
import { elements, renderLoader, clearLoader } from "./views/domStore";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shoppingListView from "./views/shoppingListView";
import * as likeView from "./views/likeView";
/*
global state of the app
-search object
-current recepie object
-shopping list object
-liked recipe 
 */
const state = {

}
const controlSearch = async () => {
    //get query from search
    const query = searchView.getInput();
    if (query) {
        //create new search object and add to the state
        state.search = new Search(query);
        //prepare UI for results
        searchView.clearInput();
        searchView.clearList();
        renderLoader(elements.searchResult);
        //search for recipe
        try {
            await state.search.getRecipe();
            //display the result
            clearLoader();
            searchView.displayRecipeList(state.search.result);
        }
        catch (err) {
            alert("problem loading serches!!!");
        }

    }

}

elements.searchButton.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
})
document.addEventListener("keypress", (e) => {
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
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if (state.search) searchView.highlightSelected(id);
        state.recipe = new Recipe(id);
        console.log("get recipe");

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        state.recipe.calcTime();
        state.recipe.calcServings();
        clearLoader();

        recipeView.displayIngredients(state.recipe, state.likes.isLiked(id));
        




    }

}
/* 
Shopping list controller
*/
const checkDuplicate=(el)=>{
  
      const currentItems=state.list.items.map((i)=>{

                   return i.ingredient;
      });
      console.log(currentItems);
      if(state.list.items.length>=1){
            if(currentItems.includes(el.ingredient)){
                return false;
            }
            else{
                console.log("not true ");
                return true;
            }
        
           
      }
      else{
         // console.log("not in list");
        return true;
      }
   
    
    
    
} 
const controlList = () => {

    // Create a new list IF there in none yet
    if (!state.list) state.list = new Shoppinglist();
    // Add each ingredient to the list and UI
   /*  state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderItem(item);
    }); */
    const finalIngredients=[];
    
    state.recipe.ingredients.forEach(el => {
        //check if the ingredients is already in shopping list
        const finalItems= checkDuplicate(el); 
        //if not prepare the items to display in ui
        if(finalItems){
            finalIngredients.push(el);
        }

    });
   
    if(finalIngredients.length>0){
    finalIngredients.forEach(el => {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);  
            shoppingListView.renderItem(item);
        
        //render delete All button
        shoppingListView.toggleDeleteAllMenu(state.list.items.length);
    });
    
}


}


elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log("id id "+ id);

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        shoppingListView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

 elements.deleteAllShoppingList.addEventListener('click', ()=> {
     const items=state.list.items;
     console.log(items);
    if(items.length>=1){
        items.forEach((item)=>{  
            //delete from the UI first  
            shoppingListView.deleteItem(item.id);  
        })
    }
    //delete from the state also
    state.list.items.splice(0,state.list.items.length);

    shoppingListView.toggleDeleteAllMenu(state.list.items.length);
    
}) 

/* 
Liked controller
*/


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // recipe has NOT yet been liked 
    if (!state.likes.isLiked(currentID)) {

        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likeView.toggleLikeBtn(true); //this means set it to liked

        // Add like to UI list
        likeView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likeView.toggleLikeBtn(false); //this means set it to not liked

        // Remove like from UI list
        likeView.deleteLike(currentID);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());

}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new Shoppinglist();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    // Toggle delete All from Shopping list  button
    shoppingListView.toggleDeleteAllMenu(state.list.items.length);

    // Render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));
});


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//event to increase or decrese serving
elements.recipe.addEventListener("click", e => {

    if (e.target.matches(".btn-decrease,.btn-decrease *")) //btn_decrease* means any target that is child of btn-decrease

    {
        if (state.recipe.servings > 1) {

            state.recipe.updateServing("decreasing");
            recipeView.updateServingIngredients(state.recipe);
        }

    }
    if (e.target.matches(".btn-increase,.btn-increase *")) {

        state.recipe.updateServing("increasing");
        recipeView.updateServingIngredients(state.recipe);
    }
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add recipe to like list
        controlLike();
    }

})



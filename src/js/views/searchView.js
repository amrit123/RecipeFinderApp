import { elements } from "./domStore";

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = "";
}

export const clearList = () => {
    elements.searchList.innerHTML = "";

}
const reduceTitleLength = (title, limit = 17) => {
    let accumulator = 0;
    const newTitle=[];
    if(title.length>limit){
        title.split(" ").forEach((cur)=>{
            if(accumulator+cur.length<=limit){
                newTitle.push(cur);
            }
            accumulator=accumulator+cur.length;


        })
        return `${newTitle.join(" ")}...`;

    }
    return title;
    }
   




const displayEachRecipe = (recipe) => {
    const dom = `

    <li>
    <a class="results__link results__link--active" href="${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${reduceTitleLength(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>

    `;
    elements.searchList.insertAdjacentHTML("beforeend", dom);
}

export const displayRecipe = (recipes) => {
    recipes.forEach(displayEachRecipe);
}
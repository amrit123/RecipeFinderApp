import { elements } from "./domStore";

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = "";
}

export const clearList = () => {
    elements.searchList.innerHTML = "";
    elements.searchResultPagination.innerHTML = "";

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
    <a class="results__link" href="#${recipe.recipe_id}">
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


const createButton = (pageNo, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? pageNo - 1 : pageNo + 1}>
        <span>Page ${type === 'prev' ? pageNo - 1 : pageNo + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderPagination=(pageNo,totalResults,resultPerPage)=>{

    
    const totalPages = Math.ceil(totalResults / resultPerPage);

    let button;
    if (pageNo === 1 && totalPages > 1) {
        console.log(pageNo);
        // Only button to go to next page
        button = createButton(pageNo, 'next');
    } else if (pageNo < totalPages) {
        // Both buttons
        
        button = `
            ${createButton(pageNo, 'prev')}
            ${createButton(pageNo, 'next')}
        `;
    } else if (pageNo === totalPages && totalPages > 1) {
        // Only button to go to prev page
        button = createButton(pageNo, 'prev');
    }

    elements.searchResultPagination.insertAdjacentHTML('afterbegin', button);
}



export const displayRecipe = (recipes,pageNo=1,resultPerPage=10) => {
    const start=(pageNo-1)*resultPerPage;
    const end=pageNo*resultPerPage;
    recipes.slice(start,end).forEach(displayEachRecipe);
    renderPagination(pageNo, recipes.length, resultPerPage);
}
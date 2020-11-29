import {elements} from './base'

export const getInput = () => elements.searchInput.value //value of search field input

export const clearInput = () => {
    elements.searchInput.value = ""
}

export const clearResults = () => {
    elements.searchResList.innerHTML = ''
    elements.searchResPages.innerHTML = ''
}

export const highlightSelected = (id) => {
    //creates a new, shallow-copied Array instance from an array-like or iterable object
    const resultsArray = Array.from(document.querySelectorAll('.results__link'))
    resultsArray.forEach((currEl) => {
        currEl.classList.remove('results__link--active')
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active')
}

/** 'Pasta with tomato and spinach'
 * acc: 0(inital) | acc + cur.length = 5(Pasta) | newTitle = ['Pasta']
 * acc: 5 | acc + cur.length = 9(5+4) | newTitle = ['Pasta', 'with']
 * acc: 9 | acc + cur.length = 15(9+6) | newTitle = ['Pasta', 'with', 'tomato']
 * acc: 15 | acc + cur.length = 18(15+3) | newTitle = ['Pasta', 'with', 'tomato']
 * acc: 18 | acc + cur.length = 25(18+7) | newTitle = ['Pasta', 'with', 'tomato']
 */
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit) {
        title.split(' ').reduce( (acc, cur) => {  //split space with comma between word & turn into array
            if (acc + cur.length <= limit) {
                newTitle.push(cur) //add into new array
            }
            return acc + cur.length //update the acc in each iteration 
        }, 0) //end of reduce
        //return the result
        return `${newTitle.join(' ')} ...` //oppsite of split - turn into string
    }// end of if statement
    return title //return if the title is less then or equal 17
 }

//Render one single recipe 
const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    /*parses the specified text as HTML and inserts the resulting nodes into 
    the DOM tree at a specified position.*/
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

//page = the number of page we are in & type = 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1} >
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button> `;

//render the buttons according to the number of the page we are on
const renderButtons = (page, numResults, resPerPage) => {
    //how many pages there are ? Math.ceil() -> 40/10 give 4.5 & math function make it 5
    const pages = Math.ceil(numResults / resPerPage) //e,g 30 recepie results and 10 resPerPage give 3 pages
    //Need to know on which page we are
    let button
    // if we are on page one and if there is only one page of result then dont display button at all
    if (page === 1 && pages > 1) { 
        //only button to go to the next page
        button = createButton(page, 'next')
    } 
    //in the middle pages e.g if page 2 less 3 pages of result
    else if (page < pages) {  
        //show both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    }
    //if we are on last page & if on last page then we want the prev button
    else if (page === pages && pages > 1) {
        //only button to go to prev page
        button = createButton(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

/* recipes parameter contains each receipe object in the array [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, ...]*/
export const renderResults = (recipes, page = 1, resPerPage = 10) => { 
    /*Example: let say page = 1 & resPerPage = 5, then the start varaible will have ((1-1 = 0) * 5 = 0 and 
    the start index is 0 and end will be 1 * 5 = 5 and slice until index 4 because array index start from zero)
    ***Render results of current page*/
    const start = (page - 1) * resPerPage //start at the specific index of array object
    const end = page * resPerPage 
    recipes.slice(start, end).forEach(renderRecipe) //loop all recipes and call renderRecipe for each of them
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
}


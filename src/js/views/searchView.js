import {elements} from './base'

export const getInput = () => elements.searchInput.value //value of search field input

export const clearInput = () => {
    elements.searchInput.value = ""
}

export const clearResults = () => {
    elements.searchResList.innerHTML = ''
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
        <a class="results__link" href="${recipe.recipe_id}">
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

export const renderResults = (recipes) => { /*[{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, ...]*/
    recipes.forEach(renderRecipe) //loop all recipes and call renderRecipe for each of them
}
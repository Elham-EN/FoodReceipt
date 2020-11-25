import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import {elements, renderLoader, clearLoader} from './views/base'

/*Global state of the app: everything accessible from the state
** - Search object data: Search query and result
** - Current recipe object
** - Shopping list object
** - Liked recipes
*/
const state = {} //empty object

/**
 * Search Controller
 */
const controlSearch =  async () => {
    //1) Get query from view
    const query = searchView.getInput() //get input value 
    if (query) {
        //2) New search object and add to state object
        state.search = new Search(query)
        //3) Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)
        try {
             //4) Search for recipes - receive data from API 
            await state.search.getResults() //await until promise resolved
            //5) Render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)
            /* The Result:  (23) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…},*/
            //console.log("The Result: ",state.search.result);
        } catch (error) {
            alert(error)
        }
    }
} //end of controlSearch

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault() //prevent page from reloading
    controlSearch()
})

elements.searchResPages.addEventListener('click', (e) => {
    //returns the closest ancestor of the current element
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        //provides read/write access to custom data attributes (data-*) on elements
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()  //  recipes,         page = goToPage(e.g 1) ,   ...
        searchView.renderResults(state.search.result, goToPage)
    }
})


/**
 * Recipe Controller
*/

const controlRecipe = async () => {
    //location object contains information about the current URL.
    //returns the anchor part of a URL, including the hash sign (#)
    const id = window.location.hash.replace('#', '') //get ID from URL & remove hash
    
    if (id) { //if we have the id from the URL then...
        //Prepare UI for changes

        //Create new recipe object
        state.recipe = new Recipe(id)
        try {
            //Get recipe data - to await for promise to resolved or reject
            await state.recipe.getRecipe()
            //Calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            //Render recipe
            console.log(state.recipe);
        } 
        catch (error) {
            alert(error)
        }
    }
}

/*event occurs when there has been changes to the anchor part (begins with a '#' symbol) of the current URL */
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))




import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Like from './models/Like'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likeView from './views/likeView'
import {elements, renderLoader, clearLoader} from './views/base'
import Likes from './models/Like'

/*Global state of the app: everything accessible from the state
** - Search object data: Search query and result
** - Current recipe object
** - Shopping list object
** - Liked recipes
*/
const state = {} //empty object
window.state = state

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
 * Recipe Controllers
*/
const controlRecipe = async () => {
    //location object contains information about the current URL.
    //returns the anchor part of a URL, including the hash sign (#)
    const id = window.location.hash.replace('#', '') //get ID from URL & remove hash
    
    if (id) { //if we have the id from the URL then...
        //Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)
        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id)
        //Create new recipe object
        state.recipe = new Recipe(id)
        try {
            //Get recipe data - to await for promise to resolved or reject
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
            //Calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            //Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
        } 
        catch (error) {
            alert(error)
        }
    }
}

/*event occurs when there has been changes to the anchor part (begins with a '#' symbol) of the current URL */
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/**
 * List Controller
 */
const controlList = () => {
    //create a new list, if there is notting in the list yet then
    if (!state.list) state.list = new List() //initialze with empty object

    //Add each ingredient to the list and to the UI
    state.recipe.ingredients.forEach((currEl) => {
        const item = state.list.addItem(currEl.count, currEl.unit, currEl.ingredient)
        listView.renderItem(item)
    })
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', (event) => {
    const id = event.target.closest('.shopping__item').dataset.itemid 
    console.log(id);

    //Handle the delete button
    if (event.target.matches('.shopping__delete *, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id)

        //Delete from UI
        listView.deleteItem(id)
    } 

    //Handle the count update
    else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value, 10)
        state.list.updateCount(id, val)
    }
})

/**
 * Like Controller
 */
//TESTING


 const controlLike = () => {
     if (!state.likes) state.likes = new Like()
     const currentID = state.recipe.id

     //User has not yet liked current recipe
     if(!state.likes.isLiked(currentID)) {
         //Add like to the state
         const newLike = state.likes.addLike(
             currentID,
             state.recipe.title,
             state.recipe.author,
             state.recipe.img
         )
         //Toggle the like button
         likeView.toggleLikeBtn(true)

         //Add like to UI list
         likeView.toggleLikeMenu(state.likes.getNumLikes())
         likeView.renderLike(newLike)

     //User has liked current recipe
     } else {
         //Remove like from the state
         state.likes.deleteLike(currentID)

         //Toggle the like button
         likeView.toggleLikeBtn(false)

         //Remove like from UI list
         likeView.toggleLikeMenu(state.likes.getNumLikes())
         likeView.deleteLike(currentID)
     } 
 }

 //Restore liked recipes on page load
 window.addEventListener('load', () => {
    state.likes = new Like()
    //Restore likes
    state.likes.readStorage()
    //Toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes())
    //Render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like))
 })

//Handling recipe button clicks - Event Delegation
elements.recipe.addEventListener('click', (event) => {
    if (event.target.matches('.btn-decrease, .btn-decrease *') ) {
        if (state.recipe.servings > 1) {
            //Decrease button clicked
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
    }
    else if (event.target.matches('.btn-increase, .btn-increase *') ) {
        //increase button is clicked 
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
    else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping List
        listView.clearList()
        controlList()
        console.log(state.recipe.ingredients.length);        
    }
    else if (event.target.matches('.recipe__love, .recipe__love *')) {
        //Like Controller
        controlLike()
    }
    //console.log(state.recipe);
}) 




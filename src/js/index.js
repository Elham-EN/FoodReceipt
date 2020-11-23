import Search from './models/Search'
import * as searchView from './views/searchView'
import {elements} from './views/base'

/*Global state of the app: everything accessible from the state
** - Search object data: Search query and result
** - Current recipe object
** - Shopping list object
** - Liked recipes
*/
const state = {} //empty object

const controlSearch =  async () => {
    //1) Get query from view
    const query = searchView.getInput() //get input value 
    if (query) {
        //2) New search object and add to state object
        state.search = new Search(query)
        //3) Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        //4) Search for recipes - receive data from API 
        await state.search.getResults() //await until promise resolved

        //5) Render results on UI
        searchView.renderResults(state.search.result)
        /* The Result:  (23) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…},*/
        //console.log("The Result: ",state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault() //prevent page from reloading
    controlSearch()
})



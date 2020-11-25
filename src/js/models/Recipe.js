import axios from 'axios'
//export individual features as default
export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`) //get data
            this.title = res.data.recipe.title
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url
            this.ingredients = res.data.recipe.ingredients
        } 
        catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    calcTime() {
        //Assuming that we need 15 min for each 3 ingredients
        const numIngred = this.ingredients.length
        const periods = Math.ceil(numIngred / 3)
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4
    }
}
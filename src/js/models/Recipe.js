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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitsShort, 'kg', 'g']

        //Through each iterations save the item into the new array
        //0: "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"
        const newIngredients = this.ingredients.map((currEl) => {

            //1) Uniform units - all should be same
            let ingredient = currEl.toLowerCase() //contain current element of this.ingredients

            //Need both current element and current index
            unitsLong.forEach((unit, i) => { //replace() - searches a string for a specified value
                //replace current element of unitsLong with unitsShort in the same position
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            //2) Remove parenthses- /pattern/ & g - global match & find any of chars between [] &
            //(): Matches x and remembers the match & *: Matches the preceding item "x" 0 or more times. 
            // /bo*/ matches "boooo"
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ")
            //console.log("Ingredient: ", ingredient);

            //3) Parse ingredients into count, unit and ingredients & return as an array
            //2: "1 tsp Orange Zest" when there is space, it split and each word become element
            const arrIng = ingredient.split(' ') //=> (4) ["1", "tsp", "orange", "zest"]
            //console.log("Array_Ingredient: ",arrIng);

            //returns the index of the first element in the array that satisfies the provided testing function
            const unitIndex = arrIng.findIndex(currEl2 => units.includes(currEl2))
            let objIng;
            
           // console.log("Unit_Index: ", unitIndex);
            if (unitIndex > -1) {
                //There is a unit Ex. 4 1/2 cups, arrCount is [4, 1/2] // 4 cups, arrCount is [4] -> eval("4+1/2") = 4.5
                //arrIng -> (10) ["4", "1/2", "cup", "unbleached", "high-gluten,", "bread,", "or", "all-purpose", ...]
                const arrCount = arrIng.slice(0, unitIndex) //-> unitIndex must 1, can't be -1
                //console.log('Array_Count: ',arrCount);
                let count
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                    //console.log("arrIng_Index: ",arrIng[0]);
                    //console.log('Count: ', count);
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                    //console.log('Count: ', count);
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') //slice all the way to the end
                }
                //console.log('ObjIngredient: ',objIng.ingredient);
            }
            else if (parseInt(arrIng[0], 10)) {
                //There is no unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') //rest of the elements are the ingredients
                }
            }
            else if (unitIndex === -1) {
                //There is no unit & no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient 
                }
            }
            return objIng //each iteration return value to the current position of the new array
        })
        this.ingredients = newIngredients
    }

    updateServings(type) { //type = increase or decrease
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

        //Ingredients - if servings update then must also update ingredients count
        this.ingredients.forEach((currIngred) => { 
            currIngred.count *= (newServings / this.servings)
        })

        this.servings = newServings; //this update the instance variable 
    }
}
import {nanoid} from 'nanoid'

export default class List {
    constructor() {
        this.items = [] //all the elements in the list will be store here
    }

    //Add new item to the list
    addItem(count, unit, ingredient) {
        const item = {
            id: nanoid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item) //store array of item objects
        return item
    }

    deleteItem(id) { //find item based on the id
        //return the index of first element that satisfied the condition
        /*0: {id: "7ttoTeIWqWQC_0FQTmwq2", count: 1, unit: "tbsp", ingredient: "sugar"}
          1: {id: "_TTgZNosGLAoVy4KB4cim", count: 2, unit: "tbsp", ingredient: "curry power"}
          2: {id: "hPBI_bRnoZQXt-ds85U1W", count: 6, unit: "tbsp", ingredient: "tumeric"}
          list.deleteItem("hPBI_bRnoZQXt-ds85U1W") index = 2 | [obj1, obj2, obj3]*/ 
        const index = this.items.findIndex(currEl => currEl.id === id )
        console.log(index); 
        /*[2,4,8] splice(1,2) --> returns [4,8], original array (mutated) is [2] 
        **[2,4,8] slice(1,2) --> returns [4], origianl array is [2,4,8] */
        this.items.splice(index, 1) //remove element from the array
    }

    updateCount(id, newCount) {
        //find() return the first element (item) in the array
        //loop through all the elements in the items array and select the one that match the id
        this.items.find(currEl => currEl.id === id).count = newCount //and return object & change the count property
    }

} 
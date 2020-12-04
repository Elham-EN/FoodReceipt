export default class Like {
    constructor() {
        this.likes = []
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img}
        this.likes.push(like) //push like object into array 
        //Persist data in localStorage 
        this.persistData()
        return like
    }  

    deleteLike(id) {
        const index = this.likes.findIndex(currEl => currEl.id === id)
        this.likes.pop(index)
        //Persist data in localStorage 
        this.persistData()
    }

    //if findIndex is minus -1, it means its not there, if we cannot find any item with that id that we passed in 
    //then it is minus 1 and return false. if it turns out that it is not minus 1 then it will return true
    isLiked(id) { 
        return this.likes.findIndex(currEl => currEl.id === id) !== -1
    }

    getNumLikes() {
        return this.likes.length
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'))
        //Restoring likes from the localStorage
        if (storage) this.likes = storage
    }
}
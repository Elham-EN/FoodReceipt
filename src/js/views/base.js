//Create object which contain all the elements we select from the DOM
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likeMenu: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list')
}

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = (parent) => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    parent.insertAdjacentHTML('afterbegin', loader) //parent element = <div class='results'>
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if (loader) {
        loader.parentElement.removeChild(loader) //move up to parent element <div class='results'>
    }
}
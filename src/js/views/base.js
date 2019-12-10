export const elements = { // Holen uns alle fixe Doms die wir brauchen und exportieren diese
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    shoppingParent: document.querySelector('.shopping'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = { // dynamisch erzeugte Doms
    loader: 'loader',
    deleteAllButton: '.delete__All',
    shoppingItem: '.shopping__item',
    countInput: '#new-count',
    unitInput: '#new-unit',
    ingInput: '#new-ing',
    addNewItem: '#add-new-item'
}

// Unser Spinning Loader
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader); // gehen hoch zum parent und removen das child mit der Klasse loader
    }
}
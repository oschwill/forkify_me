import {elements, elementStrings} from './base'; // Holen uns die Doms 

export const renderItem = (item, para) => {
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>    
    `;    
   
    para === undefined ? elements.shopping.insertAdjacentHTML('beforeend', markup) : elements.shopping.insertAdjacentHTML('afterbegin', markup)
    
    // clear input Felder
};

export const ClearInputFields = () =>{
    document.querySelector(elementStrings.countInput).value = "";
    document.querySelector(elementStrings.unitInput).value = "";
    document.querySelector(elementStrings.ingInput).value = "";
}

export const renderDeleteButton = () => {    
    const button = `
    <button class="btn delete__All">
        <svg class="search__icon">
            
        </svg>
        <span>Alles löschen</span>
    </button>
    `;

    elements.shopping.insertAdjacentHTML('afterend', button);  
}

export const renderInputIngridients = () => {
    const input = `
    <div>
        <h2>neue Ingredients</h2>
        <form>
        <span class="input__label">Count:</span><input type="number" id="new-count" >
        <span class="input__label">Unit:</span> <select id="new-unit">
            <option></option> 
            <option>cup</option> 
            <option>tsp</option> 
        </select><br>
        <span class="input__label">Ingredient:</span><input type="text" id="new-ing">
        <button id="add-new-item" class="btn">add</button>
        </form>
    </div>
    `;
    elements.shopping.insertAdjacentHTML('beforebegin', input);  
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`); // sucht nach einem Element mit [data-itemid="${id}"]
    // Beispiel in item : <li class="shopping__item" data-itemid="k3enk28j">...
    // springt zum Parent shopping__list und von dort removen wir das child <li class="shopping__item" data-itemid="k3enk28j">...
    item.parentElement.removeChild(item);  
};

export const deleteAllItems = () => {   

    const item = document.querySelector(elementStrings.shoppingItem);

    item.parentElement.previousElementSibling.remove(); // Lösche Inputfelder

    item.parentElement.nextElementSibling.remove(); // lösche Button
    
    item.parentElement.innerHTML = ''; // Lösche ingredient Liste
}
// View
import {elements} from './base'; // Holen uns die Doms 

// eine einzeillige Arrowfunction benötigt kein return. es ist ein impliziter Aufruf und returnt den Wert automatisch!!
export const getInput = () => elements.searchInput.value; 

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    // mit Array.from wandeln wir die nodelist direkt in ein Array um
    const resultsArr = Array.from(document.querySelectorAll('.results__link')); 
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

// Den Titel kürzen. Maximaler Char Limit ist 17
/* die reduce Methode anhand eines Beispiels: 
string: 'Pasta with tomato and spinach'
acc = 0 => acc + curlength = 5  <= 0 + länge von Pasta, füge zu Array => [Pasta]
acc = 5 => acc + curlength = 9  <= 5 + länge von with, füge zu Array => [Pasta, with]
acc = 9 => acc + curlength = 15 <= 9 + länge von tomato, füge zu Array => [Pasta, with, tomato]
acc = 15 => acc + curlenth = 18 <= 15 + länge von and, kein hinzufügen zu array
DAS Limit wurde überschritten und der neue Title im Array returnt!
*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){ // 
        // Die reduce()-Methode reduziert ein Array auf einen einzigen Wert, indem es jeweils zwei Elemente (von links nach rechts) durch eine gegebene Funktion reduziert.
        title.split(' ').reduce((acc, cur) => {
            // wenn der acc plus die länge des Wortes im array kleiner gleich dem limit von 17 ist
            // dann push den Wert in unser Array.
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length; // Wir return das Ergebnis in den accumulator
        }, 0); // Starten mit einem accumulator von 0
        // return das Array
        return `${newTitle.join(' ')}...`; // join konvertiert das Array in einen string separiert durch Leerzeichen!
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>    
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type kann prev oder next sein
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Seite ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>        
    </button>
`;

// erzeuge die nächste und vorherige Buttons für die pagination
const renderButtons = (page, numResults, resPerPage) => {
    // Anzahl der Treffer durch Anzahl der Treffer pro Seite = Anzahl Seiten
    const pages = Math.ceil(numResults / resPerPage); // ceil rundet auf. Wenn wir z.b. 4,5 haben wird dann auf 5 gerundet

    let button;

    if(page === 1 && pages > 1){ // Wenn wir auf der ersten Seite sind
        // nur Button für nächste Seite wenn Seite 1 ist und es mehrere Seiten gibt
        button = createButton(page, 'next');
    }else if(page < pages){ // Wenn wir inmitten der Seiten sind
        // Button für nächste und vorherige Seite
        button = `${createButton(page, 'prev')}
                  ${createButton(page, 'next')}
        `;
    }else if(page === pages && pages > 1){ // Wenn wir auf der letzten Seite sind
        // nur Button für vorherige Seite und es mehrere Seiten gibt
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Pagination
    const start = (page - 1) * resPerPage; // im ersten Durchlauf 0 im zweiten 10, im dritten 20 usw.
    const end = page * resPerPage;   // im ersten durchlauf 10, im zweiten 20 im dritten 30 usw.  
    //console.log(end);
    // slice erzeugt ein neues Array von einem Start bishin zu einem End Index! End wird nicht mit einbezogen daher im ersten Durchlauf nur bis 9, im zweiten bis 19 usw.
    recipes.slice(start, end).forEach(renderRecipe);

    // erzeuge Pagination Buttons
    renderButtons(page, recipes.length, resPerPage);
};
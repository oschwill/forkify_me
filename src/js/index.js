// Controller
// import str from './models/Search'; // Erstes Import Beispiel
// //import {add as a, multiply as m, ID} from './views/searchView'; // zweites Import Beispiel
// import * as searchView from './views/searchView'; // drittes Import Beispiel

// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}`);
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView'; // Holen uns alles aus der searchView
import * as recipeView from './views/recipeView'; // Holen uns alles aus der recipeView
import * as listView from './views/listView'; // Holen uns alles aus der listView
import * as likesView from './views/likesView'; // Holen uns alles aus der listView

import {elements, renderLoader, clearLoader, elementStrings} from './views/base'; // Holen uns die Doms 


/** der globale Status der App 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes
 * **/
const state = {};
let dlButton = false;
//window.state = state; // global erstellen damit wir in der Konsole darauf Zugriff haben

/** Der Search Controller! **/
const controlSearch = async () => {
    // 1) hole den query 
    const query = searchView.getInput(); // holen uns den Wert aus dem suchfeld

    if(query) {
        // 2) neues Search object erstellen und zum Status adden
        state.search = new Search(query.toLowerCase());
    }

    // 3) Prepare UI for results
    searchView.clearInput(); // cleart das Suchfeld
    searchView.clearResults(); // cleart die Ergebnisse
    renderLoader(elements.searchRes); // is der Loader zwischen der Aufruf und Darstellungszeit
    // 4) Suche nach recipes
    try { // diesen trycatch halte ich für unnötig!
        await state.search.getResults(); // Warten bist die Daten angekommen sind

        // 5) Render results on UI
        clearLoader(); // den Spinning loader entfernen
        searchView.renderResults(state.search.result); // Holen uns die Daten und geben diese aus   
    } catch (err) {
        alert('Irgendetwas lief nicht korrekt...');
        clearLoader(); // den Spinning loader entfernen
    }    
}

// Eventlistener
elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault(); // verhindert das die Seite über das form Tag neu läd!
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // closest holt sich den nächstgelegenen Ancestor
    
    if(btn){
        // lesen das data-goto Element aus mit btn.dataset.goto, siehe createButton() Funktion
        const goToPage = parseInt(btn.dataset.goto, 10);// in einen integer im Dezimalsystem 10 konvertieren 
        
        // cleare vorher die bestehenden results und Buttons
        searchView.clearResults();

        // rufe neue results ab mit der neuen pagezahl
        searchView.renderResults(state.search.result, goToPage);        
    }
});

/** Der Get Recipe Controller! **/
const controlRecipe = async () =>{
    const id = window.location.hash.replace('#', ''); // holen uns hash der url z.b. #46956 und ersetzten das # mit nichts

    if(id){
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight das Rezept
        if(state.search){
            searchView.highlightSelected(id);
        }        

        // Erstelle neue recipe Object
        state.recipe = new Recipe(id);

        try { // diesen try catch halte ich für unnötig!
            // Hole die recipe Daten und parse die Daten      
            await state.recipe.getRecipe();
            
            state.recipe.parseIngredients();

            // Caclulate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();            
            recipeView.renderRecipe(
                        state.recipe,
                        state.likes.isLiked(id));            
        } catch (err) {
            alert('Error !! Kann Recipe nicht laden!');
        }        
    }
};

// hashchange erzeugt ein Event wenn sich der hash in der url ändert, z.b. http://localhost:8080/#47746 <= das #47746
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // durchläuft ein array mit events

/** Der List Controller **/
const controlList = () => {    
    // Create a new List if there is none yet
    if(!state.list){
        state.list = new List();
    } 

    // Erstelle Ingridient Input
    dlButton === false ? listView.renderInputIngridients() : null;

    // Add each ingredient to the list and UI    
    state.recipe.ingredients.forEach(el => {
        const item = state.list.additem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

    // erstelle deleteButon 
    dlButton === false ? listView.renderDeleteButton() : null;

    dlButton = true;     
}

// Handle delete and update List item events
elements.shopping.addEventListener('click', e => { // das Event wird vom obersten Parent ausgeführt     
    const id = e.target.closest('.shopping__item').dataset.itemid; // das Target das am nächsten entfernt ist von unserem click

    // Handle the delete Event
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);        

        // Handle the count update
    }else if(e.target.matches('.shopping__count-value')){
        const val =parseFloat(e.target.value); // holen uns den Value vom target das geklickt wurde
        state.list.updateCount(id, val);
    } 
});

elements.shoppingParent.addEventListener('click', e => {
     
    if(e.target.matches(`${elementStrings.deleteAllButton}, ${elementStrings.deleteAllButton} *`)){

        // Lösche aus Array
         state.list.deleAllItems();

        // Lösche aus UI
         listView.deleteAllItems();

         dlButton = false;
    }else if(e.target.matches(elementStrings.addNewItem)){
        // Hinzufügen einzelner Ingridients
        const count = document.querySelector(elementStrings.countInput).value;
        const unit = document.querySelector(elementStrings.unitInput).value;
        const ingredient = document.querySelector(elementStrings.ingInput).value;

        if(!state.list){
            state.list = new List();            
        }

        if(count == null || count == ""){ 
            document.querySelector(elementStrings.countInput).style.border = '1px solid red';          
            return;
        }else if(ingredient == null || ingredient == ""){
            document.querySelector(elementStrings.countInput).style.border = '1px solid grey';
            document.querySelector(elementStrings.ingInput).style.border = '1px solid red'; 
            return;
        }
        document.querySelector(elementStrings.ingInput).style.border = '1px solid grey'; 
        const item = state.list.additem(count, unit, ingredient, true);
        listView.renderItem(item, 'true'); 

        //listView.ClearInputFields();
        return;       
    }
    
});
/** Der Like Controller **/
const controlLike = () => {
    if(!state.likes){
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;
    // User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI List
        likesView.renderLike(newLike);

    // User has liked current recipe
    }else{
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like to the UI List
        likesView.deleteLike(currentID);
    }
    // beeinflusst das obere rechte Herz, wenn keine likes dann soll es nicht erscheinen, wenn likes dann soll es erscheinen
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 
};

// Restore like recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new List();

    // Restore likes
    state.likes.readStorage();
    state.list.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing Likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
    state.list.items.forEach(item => listView.renderItem(item));
    
    if(state.list.items.length > 0){
        listView.renderInputIngridients();
        listView.renderDeleteButton();
    }
    
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => { // das Event wird vom obersten Parent ausgeführt
     // .btn-decrease * bedeutet wenn ich btn-decrease drüke oder auf seine childs
    if(e.target.matches('.btn-decrease, .btn-decrease *')){ // das target muss mit der Klasse btn-decrease übereinstimmen
        // Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    }

    if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to shopping list
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like controller
        controlLike();
    }
});

//window.l = new List(); // global erstellen damit wir in der Konsole darauf Zugriff haben
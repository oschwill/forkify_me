import {elements} from './base'; // Holen uns die Doms 
import {limitRecipeTitle}  from './searchView'; // Holen uns die Methode limitRecipeTitle aus der searchView

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    // Mit setAttribute tauschen wir den inhalt eines html attributs aus
    // aus z.B. <use href="img/icons.svg#icon-heart-outlined"></use>
    // wird <use href="img/icons.svg#icon-heart"></use>
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${limitRecipeTitle(like.title)}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    // Mit [href*="${id}"] holen wir uns z.B. folgendes Element <a class="likes__link" href="#47746">... die eine Klasse likes__link besitzen
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement; //[href*="${id}"] holt die id im link z.B. #47746
    if(el){
        el.parentElement.removeChild(el);
    }
};
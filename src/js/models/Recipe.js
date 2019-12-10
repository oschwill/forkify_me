import axios from 'axios';
import { axiosLinkID } from '../config';


export default class Recipe{
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${axiosLinkID}${this.id}`);
            this.title =  res.data.recipe.title;
            this.author =  res.data.recipe.publisher;
            this.img =  res.data.recipe.image_url;
            this.url =  res.data.recipe.source_url;
            this.ingredients =  res.data.recipe.ingredients;
            //console.log(res);           
        }catch(error){
            console.log(error);
            alert('Etwas lief falsch :(');
        }
    }

    calcTime(){
        // Wir gehen davon aus, dass wir 15 Minuten für alle 3 Zutaten brauchen
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoons', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']; // wir ersetzten die unitsLong mit der kürzeren Version
        const units = [...unitsShort, 'kg', 'g']; // Destructuring

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) =>{ // durchlaufen unitsLong und ersetzten die Einträge mit unitsshort
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses (Klammern)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // Entfernt alles was in () Klammern ist inkl. Klammer mit einem Leerzeichen

            // 3) Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            // includes returnt true wenn das element im array vorhanden ist und false wenn nicht!
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));// Hole den Index

            let objIng;
            if(unitIndex > -1){
                // Es gibt eine unit aus unitShorts
                // Beispiel: 4 1/2 cups, arrCount ist [4, 1/2] -> eval("4+1/2") -> 4.5
                // Beispiel: 4 cups, arrCount ist [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            }else if(parseInt(arrIng[0], 10)){
                // There is no unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // slice erzeugt ein neues flaches Array. in unserem Fall ab Index 1. Join erzeugt aus dem Array wieder ein String mit Leerzeichen getrennt
                    ingredient: arrIng.slice(1).join(' ') 
                }
            }else if(unitIndex === -1){
                // Es gibt keine Unit und keine number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // in ES6 erzeugt er automatisch das Property ingredient und weist den Wert von ingredient zu!
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    // Portionen minimieren oder maximieren
    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
// Model
/* for Recipe.js */
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
import axios from 'axios';
import { axiosLinkQuery } from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try {
            //const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);  
            const res = await axios(`${axiosLinkQuery}${this.query}`);  
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }    
    }
}






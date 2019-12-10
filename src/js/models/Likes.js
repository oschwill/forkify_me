export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = { id, title, author, img };
        this.likes.push(like);

        // add Persist data in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id){
         // Holen uns den index wo die id sich befindet
         const index = this.likes.findIndex(el => el.id === id );

         // mit splice ändern wir den Inhalt des Arrays durch das Entfernen vorhandener Elemente oder hinzufügen neuer Elemente
         // [2,4,8].splice(1,1) => startet auf Position 1 mit genau 1 Element!
         if (index !== -1) this.likes.splice(index, 1); // Löschen das item

         // delete persist data in localStorage
         this.persistData(); // kann auch zum löschen verwendet werden insofern der string schon im storage existiert

    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localstorage
        if(storage){
            this.likes = storage;
        }
    }
}
// Add, delete to Shoppinglist
import uniqid from 'uniqid'; // importieren die uniqid.js => siehe packages.json

// Klasse für die Einkaufsliste!
export default class List { // mit export machen wir die Klasse public
    constructor(){
        this.items = [];
    };

    additem (count, unit, ingredient, para) {
        const item = {
            id: uniqid(), // Erzeugen eine id mit uniqid
            count, // in ES6 müssen wir nicht count: count schreiben. Nur count reicht!
            unit,
            ingredient
        }
        
        para === undefined ? this.items.push(item) :  this.items.unshift(item);     

        // im Local Storage speichern
        this.persistData();

        return item;
    };

    deleteItem(id){
        // Holen uns den index wo die id sich befindet
        const index = this.items.findIndex(el => el.id === id );

        // mit splice ändern wir den Inhalt des Arrays durch das Entfernen vorhandener Elemente oder hinzufügen neuer Elemente
        // [2,4,8].splice(1,1) => startet auf Position 1 mit genau 1 Element!        
        if (index !== -1) this.items.splice(index, 1); // Löschen das item

        // im Local Storage löschen
        this.persistData();
    };

    updateCount(id,newCount){
        // find() holt sich den wert des Elements im Array
        this.items.find(el => el.id === id).count = newCount;
    };

    deleAllItems(){              
        this.items = [];
        this.removeStorage();
    }

    // Local Storage
    persistData(list){
        localStorage.setItem('list', JSON.stringify(this.items));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('list'));

        // Restoring likes from the localstorage
        if(storage){
            this.items = storage;
        }
    }

    removeStorage(){
        localStorage.removeItem('list');
    }
}
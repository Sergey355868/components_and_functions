class Observer {
    handlers = {};
    dispatchByNumber(event,number, ...arg) {
        if (number && this.handlers[event][number - 1]) {
            this.handlers[event][number - 1](...arg);
        } else  {
            console.log(`У события "${ event }" такого слушателя или нет такого события`);
        }
    }
    dispatch(event, ...arg) {
        if (this.handlers[event] && Array.isArray(this.handlers[event]) &&
            this.handlers[event].length) {
            this.handlers[event].forEach(handler => {
                handler(...arg);
            });
        } else {
            console.log(`У события "${ event }" нет слушателей`);
        }
    }
    subscribeOnce(event, handler) {
        !this.handlers[event]
            ? this.handlers[event] = [handler]
            : void(0);
    }
    subscribe(event, handler) {
        !this.handlers[event]
            ? this.handlers[event] = [handler]
            : Array.isArray(this.handlers[event]) ? this.handlers[event].push(handler) :
            void(0);
    }
    deleteEventWitHCallback(event, handler) {
        if (event && handler) {
            if (this.handlers[event]) {
                this.handlers[event] =
                    this.handlers[event].filter( h => h !== handler);
            } else {
                console.log(`События "${event}" не существует`);
            }
        } else {
            console.log(`Передайте название события и обработчик,который следует удалить`);
        }
    }
    deleteEvents(...arg) {
        arg.forEach(event => {
            if (typeof  event === 'string') {
                if (this.handlers[event]) {
                    this.handlers[event].length = 0;
                } else {
                    console.log(`События "${ event }" не существует`);
                }
            } else {
                console.log(`Передайте строку`);
            }
        });
    }
    deleteAll() {
        this.handlers = {};
    }
}
class ForHandlers {
    constructor({
                    observer = new Observer(),
                } ={}) {
        this.observer = observer;
    }
    findDataKey(root, array, obj) {
        array.filter((dataKey) => !obj[dataKey])
            .forEach((dataKey) => {
                if (root.dataset[dataKey] !== undefined) {
                    obj[dataKey] = root;
                }
            });
        if (root.children.length) {
            for (let child of root.children) {
                this.findDataKey(child, array, obj);
            }
        }
        return obj;
    }
    findElementByDataKey(root, array, obj, countCall = 0) {
        if (countCall) {
            array = array.filter(dataKey => !obj[dataKey]);
        }
        array.forEach(dataKey => {
            if (root.dataset[dataKey] !== undefined) {
                obj[dataKey] = root;
            }
        });
        if (root.children.length) {
            for (let child of root.children) {
                this.findElementByDataKey(child, array, obj, countCall+1);
            }
        }
        return obj;
    }

    dispatchByNumber(event, number, ...arg) {
        this.observer.dispatchByNumber(event, number, ...arg);
    }
    dispatch(event, ...arg) {
        this.observer.dispatch(event, ...arg);
    }
    subscribeOnce(event, handler) {
        this.observer.subscribeOnce(event, handler);
    }
    subscribe(event, handler) {
        this.observer.subscribe(event, handler);
    }
    deleteEventWitHCallback(event, handler) {
        this.observer.deleteEventWitHCallback(event,handler);
    }
    deleteEvents(...arg) {
        this.observer.deleteEvents(...arg);
    }
    deleteAll() {
        this.observer.deleteAll();
    }
}

class Notes {
    constructor({
            elements = [
                new Field,
                new OldNotes,
            ],
            wherePaste = document.body,
            methodPaste = "append",
        } ={}) {
        this.elements = elements;
        this.wherePaste = wherePaste;
        this.methodPaste = methodPaste;
        this.createNotes(this.elements);
    }
    createNotes(elements) {
        let div_root = document.createElement('div');
        div_root.className = 'container';
        div_root.innerHTML = elements.map(ElementNotes => {
            return  ElementNotes.to_html();
        }).join('');
        if (this.wherePaste && Element.prototype[this.methodPaste] && this.wherePaste instanceof Element) {
            this.wherePaste[this.methodPaste](div_root);
            let [Field,,] = elements;
            Field.initHandlers();
        }
    }
}
class Field extends ForHandlers {
    notes = [];
    name_note = [];
    data_for_finding = ["old","enter", "descprition", "clear_all","delete_prev"];
    obj ={};
    onFocus = () => this.clear();
    onChange = event => {
        if (event.target.value.trim()) {
            console.log()
            this.dispatch('enter_name', event.target.value);
        }
        this.obj.descprition.focus();
    }
    onChangeDesc = ({target}) => {
        this.dispatch('enter_descprition', target.value);
    }
    constructor() {
        super();
    }
    to_html() {
        return`<div class="field_contaner">
                        <h4>Добавить заметку:</h4>
                        <p><label for="text ">Название заметки:</label></p>
                        <input id ="text " type="text" data-enter>
                        <p><label for="note">Текст заметки:</label></p>
                        <textarea  data-descprition name="note" id="note" cols="100" rows="10"></textarea>
                        <div>
                            <button data-clear_all>Очистить все</button>
                            <button data-delete_prev >Удалить предыдущую заметку</button>
                        </div>
                     </div>
        `;
    }
    initHandlers() {
        this.findDataKey(document.body, this.data_for_finding, this.obj);
        this.obj.clear_all.onclick = this.onClickClear();
        this.obj.delete_prev.onclick    = this.onClickPrev();
        this.obj.enter.onfocus =  this.onFocus;
        this.obj.enter.onchange = this.onChange;
        this.obj.descprition.onchange = this.onChangeDesc;
        this.onSubscribe();
    }
    clear() {
        this.obj.enter.value ='';
        this.obj.descprition.value ='';
    }
    onClickClear () {
        return () => {
            this.notes.forEach(note => note.remove());
            this.notes.length = 0 ;
            this.clear();
        };
    };
    onClickPrev()  {
        return () => {
            if (this.notes.length) {
                this.notes[this.notes.length - 1].remove();
                this.notes.length = this.notes.length - 1;
                this.clear();
            }
        };
    };
    onSubscribe() {
        this.subscribe("enter_descprition", (descprition) => {
            if (this.name_note.length) {
                this.name_note[this.name_note.length - 1].textContent = descprition;
                console.log(this.name_note[this.name_note.length -1].textContent);
            }
        });
        this.subscribe('enter_name', (note_name) => {
            if (note_name) {
                let p = document.createElement('p');
                let span   = document.createElement('span');
                span.className ="note_name";
                let span2 = document.createElement('span');
                span2.className ="note_descprition";
                span.append(note_name + ': ');
                p.append(span, span2);
                this.obj.old.append(p);
                this.notes.push(p);
                this.name_note.push(span2);
            }
        });

    }
}
class OldNotes extends ForHandlers {
    constructor() {
        super();
    }
    to_html() {
        return `
                <div class="old_contaner">
                    <div class="old_notes" data-old >
                        Предыдущие заметки:
                    </div>
                </div>
             `;
    }
}
let notes = new Notes();
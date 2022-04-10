my_imges = [
    { path:"./assets/Beach1.jpg", alt:"Пляж 1" },
    { path:"./assets/Beach2.jpg",alt:"Пляж 2" },
    { path:"./assets/Beach3.jpg",alt:"Пляж 3" },
    { path:"./assets/Mainbeach.jpg",alt:"Пляж 4" },
    {path:"./assets/more.jpg",alt:"Пляж 5"},
    {path:"./assets/more2.jpg",alt:"Пляж 6"},
    {path:"./assets/more3.jpg",alt:"Пляж 7"},
    {path:"./assets/Sun.jpg",alt:"Пляж 8"},
    {path:"./assets/tropical.jpg",alt:"Пляж 9"},
];
arrow_img = {
    prev:{
        path:"./assets/arrow/strelka.png" ,
        alt:"prev"
    },
    next:{
        path:"./assets/arrow/strelka.png" ,
        alt:"next"
    },
};
class SlideShow {
    index = 0;
    pause = true;
    elements = ["dots_contaner", "prev", "next", "img","number_text","slide_text","my_slide"];
    dot_active = null;
    root       = null;
    obj_elements = {
        dots_contaner: null,
        prev: null,
        next: null,
        img:  null,
        number_text: null,
        slide_text:  null,
        my_slide :   null,
        dots     :   null,
    };
    constructor({
        imges =[],
        arrowImges ={},
        methodPaste = 'append',
        wherePaste = document.body,
        classes = {
            active:"b-dot_slideshow_active",
            for_animation: "b-my-slide_fade",
        },
        animationName = "fade"
        }={}) {
        if(!imges.length && this.isEmptyObject(arrowImges)) {
            throw new Error(` Массив  с картинками и объект со стрелками не должны быть пустыми`);
        }
        this.animationName = animationName;
        this.classes = classes;
        this.imges = imges;
        this.arrowImges = arrowImges
        this.methodPaste = methodPaste;
        this.wherePaste =  wherePaste;
        if (this.wherePaste && this.methodPaste && Element.prototype[this.methodPaste]
            && this.wherePaste instanceof Element) {
            this.root = this.to_html();
            this.wherePaste[this.methodPaste](this.root);
        } else {
            throw new Error('Элемент не является html- элементом или способа вставки не существует');
        }
        this.findDataKey(this.root, this.elements,this.obj_elements);
        this.addListeners();
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
        if (root === this.root) {
            obj.dots =[...obj.dots_contaner.children];
        }
    }
    to_html() {
        let container = document.createElement('div');
        container.className ="b-slideshow-container";
        container.innerHTML =`
             <div class="b-my-slide " data-my_slide>
                 <div class="my-slide__number-text" data-number_text>количество страниц</div>
                 <img class="my-slide__img" src="./assets/Beach1.jpg" alt="Пляж" data-img>
                 <div class="my-slide__text" data-slide_text>Подпись текст</div>
             </div>
             <img class="b-arrow b-arrow_prev" data-prev src=${this.arrowImges.prev.path} alt=${this.arrowImges.prev.alt}>
             <img class="b-arrow b-arrow_next" data-next src=${this.arrowImges.next.path} alt=${this.arrowImges.next.alt}>
             <div class="b-dot-contaner" data-dots_contaner>
                  ${ this.imges.map( _ => `<span class="b-dot b-dot_slideshow"></span>` ).join('') }
             </div>
       `;
        return container;
    }
    addListeners() {
        window.onload = () => this.obj_elements.number_text ?
        this.obj_elements.number_text.textContent = `${ this.index + 1} / ${this.imges.length}`:void (0);
        this.obj_elements.slide_text.textContent = `${this.imges[this.index].alt}`;
        document.addEventListener('animationend', (event) => {
            if (event.animationName === this.animationName) {
                this.obj_elements.my_slide.classList.remove(this.classes.for_animation);
                this.pause = true;
            }
        });
        this.obj_elements.next.onclick = () => {
            if (this.pause) {
                this.pause = false;
                this.index++;
                if (this.index === this.imges.length) {
                    this.index = 0;
                }
                this.insertTextAndAddClasses();
            }
        };
        this.obj_elements.prev.onclick = () => {
            if (this.pause) {
                this.pause = false;
                this.index--;
                if ( this.index < 0) {
                    this.index = this.imges.length - 1;
                }
                this.insertTextAndAddClasses();
            }
        }
        this.obj_elements.dots_contaner.onclick = ({ target }) => {
            let dot_index = this.obj_elements.dots.findIndex(dot => target === dot);

            if (dot_index >= 0) {
                this.index = dot_index;
                this.insertTextAndAddClasses();
            }
        }
    }
    insertTextAndAddClasses() {
        if (this.dot_active) {
            this.dot_active.classList.remove(this.classes.active);
        }
        this.dot_active = this.obj_elements.dots[this.index];
        this.dot_active.classList.add(this.classes.active);
        this.obj_elements.img.src =  this.imges[this.index].path;
        this.obj_elements.number_text ?
            this.obj_elements.number_text.textContent = `${ this.index + 1} / ${this.imges.length}`: void (0);
        this.obj_elements.slide_text.textContent = this.imges[this.index].alt;
        this.obj_elements.my_slide.classList.add(this.classes.for_animation);
    }
    isEmptyObject(obj) {
        return  Object.keys(obj).length === 0;
    }
}
let slideShow = new SlideShow({
    imges: my_imges,
    arrowImges: arrow_img,
    wherePaste : document.body,
    methodPaste: 'prepend',
});


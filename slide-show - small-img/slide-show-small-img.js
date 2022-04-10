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
class SlideShowSmallImg {
    index = 0;
    pause = true;
    elements = ["small_img_contaner", "prev", "next", "img","number_text","slide_text","my_slide"];
    img_small_active = null;
    root       = null;
    for_delete_listeners = null;
    obj_elements = {
        small_img_contaner: null,
        prev: null,
        next: null,
        img:  null,
        number_text: null,
        slide_text:  null,
        my_slide :   null,
        small_imges :null,
    };
    constructor({
        imges =[],
        arrowImges ={},
        methodPaste = 'append',
        wherePaste = document.body,
        classes = {
            active:"b-slide-img_small-imges_active",
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
            obj.small_imges =[...obj.small_img_contaner.children];
            obj.small_imges[0].classList.add(this.classes.active);
            this.img_small_active = obj.small_imges[0];
        }
    }
    to_html() {
        let container = document.createElement('div');
        container.className ="b-slideshow-container";
        container.innerHTML =`
             <div class="b-my-slide " data-my_slide>
                 <div class="my-slide__number-text" data-number_text>количество страниц</div>
                 <img class="b-slide-img" src="./assets/Beach1.jpg" alt="Пляж" data-img>
             </div>
             <div class="my-slide__text" data-slide_text>Подпись текст</div>
             <img class="b-arrow b-arrow_prev" data-prev src=${this.arrowImges.prev.path} alt=${this.arrowImges.prev.alt}>
             <img class="b-arrow b-arrow_next" data-next src=${this.arrowImges.next.path} alt=${this.arrowImges.next.alt}>
             <div class="b-small-img-contaner" data-small_img_contaner>
                ${ this.imges.map( obj_img => `<img class="b-slide-img b-slide-img_small-imges " src=${ obj_img.path } alt=${ obj_img.alt }>` ).join('') }
             </div>
       `;
        return container;
    }
    addListeners() {
        let  animation = event => {
            if (event.animationName === this.animationName) {
                this.obj_elements.my_slide.classList.remove(this.classes.for_animation);
                this.pause = true;
            }
        };
        let transition = ({target}) => {
            if (target === this.root) {
                if (this.obj_elements.small_img_contaner.scrollLeft ) {
                    this.obj_elements.small_img_contaner.scrollLeft = 0;
                    this.index = 0;
                    this.insertTextAndAddClasses();
                }
            }
        }
        window.onload = () => this.obj_elements.number_text ?
        this.obj_elements.number_text.textContent = `${ this.index + 1} / ${this.imges.length}`:void (0);
        this.obj_elements.slide_text.textContent = `${this.imges[this.index].alt}`;
        document.addEventListener('animationend', animation );
        document.addEventListener('transitionend', transition);
        this.for_delete_listeners = [
            {"animationend":animation},
            {"transitionend":transition},
        ];
        this.obj_elements.next.onclick = () => {
            if (this.pause) {
                if ( this.img_small_active === this.obj_elements.small_imges[this.obj_elements.small_imges.length -1]) {
                    this.obj_elements.small_img_contaner.scrollLeft = 0;
                }
                this.pause = false;
                this.index++;
                if (this.index === this.imges.length) {
                    this.index = 0;
                }
                this.insertTextAndAddClasses();
                this.scrollright();
            }
        };
        this.obj_elements.prev.onclick = () => {
            if (this.pause) {
                if ( this.img_small_active === this.obj_elements.small_imges[0]) {
                    this.obj_elements.small_img_contaner.scrollLeft += this.obj_elements.small_img_contaner.scrollWidth ;
                }
                this.pause = false;
                this.index--;
                if ( this.index < 0) {
                    this.index = this.imges.length - 1;
                }
                this.insertTextAndAddClasses();
                this.scrollLeft();
            }
        }
        this.obj_elements.small_img_contaner.onclick = ({ target }) => {
            let img_index = this.obj_elements.small_imges.findIndex(dot => target === dot);

            if (img_index >= 0) {
                this.index = img_index;
                this.insertTextAndAddClasses();
            }
        }

    }
    deleteElemnt() {
        this.deleteListeners();
    }
    deleteListeners() {
        if ( this.for_delete_listeners.length) {
            this.for_delete_listeners.forEach((obj) => {
                Object.entries(obj).forEach(([event, listener]) => {
                   document.removeEventListener(event, listener);
                });
            });
        }
    }
    scrollLeft() {
        let container = this.obj_elements.small_img_contaner;
        let active   = this.img_small_active;
        let coord = container.getBoundingClientRect();
        let coord_img_active = active.getBoundingClientRect();
        let left_container = coord.left + pageXOffset;
        let left_img_active = coord_img_active.left + pageXOffset;
        if (left_img_active < left_container) {
            container.scrollLeft -= container.offsetWidth;
        }
    }
    scrollright() {
        let container = this.obj_elements.small_img_contaner;
        let active   = this.img_small_active;
        let coord = container.getBoundingClientRect();
        let coord_img_active = active.getBoundingClientRect();
        let right_container = coord.right + pageXOffset;
        let right_img_active = coord_img_active.right + pageXOffset;
        if (right_img_active > right_container) {
            container.scrollLeft += container.offsetWidth;
        }
    }
    insertTextAndAddClasses() {
        if (this.img_small_active) {
            this.img_small_active.classList.remove(this.classes.active);
        }
        this.img_small_active = this.obj_elements.small_imges[this.index];
        this.img_small_active.classList.add(this.classes.active);
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
let slideShow = new SlideShowSmallImg({
    imges: my_imges,
    arrowImges: arrow_img,
    wherePaste : document.body,
    methodPaste: 'prepend',
});


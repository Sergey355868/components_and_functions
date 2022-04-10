let arr_img_circle= [
    "./assets/Beach1.jpg",
    "./assets/Beach2.jpg",
    "./assets/Beach3.jpg",
    "./assets/Mainbeach.jpg",
    "./assets/more.jpg",
    "./assets/more2.jpg",
    "./assets/more3.jpg",
    "./assets/Sun.jpg",
    "./assets/tropical.jpg"
];
class ImgCircle {
    img = null;
    index = 0;
    constructor({
        array_img = [],
        timeout = 3000,
        where_paste=  document.body,
        method_paste = 'append',
        classes = {
            root_circle:['root-circle'],
            img_circle: ['img_circle'],
        }
        } = {}) {
        this.array_img = array_img;
        this.timeout   = timeout;
        this.where_paste = where_paste;
        this.method_paste = method_paste;
        this.classes     =  classes;
        this.img = this.createImgCircle(this.where_paste, this.method_paste, this.classes);
        //this.circleImg(this.img, this.array_img, this.timeout);
        this.circleImg = this.circleImg.bind(this, this.img, this.array_img,this.timeout);
        this.circleImg();
    }
    createImgCircle(where_paste, method_paste, classes) {
        let root = document.createElement('div');
        root.className = classes.root_circle.join(' ') ;
        let img = document.createElement('img');
        img.className = classes.img_circle.join(' ');
        root.append(img);
        if (where_paste &&  Element.prototype[method_paste]
            && where_paste instanceof Element) {
            where_paste[method_paste](root);
        } else {
            throw new Error("Элемент для вставки не обнаружен или метода вcтавки не существует");
        }
        return img;
    }
    circleImg(img, array_img, timeout ) {
        if (!array_img.length) {
            throw new Error('Массив с путями пуст');
        }
        if (this.index === array_img.length) {
            this.index = 0;
        }
        img.src = array_img[this.index];
        this.index++;
        // setTimeout(() => {
        //     this.circleImg(img, array_img, timeout);
        // },timeout);
        setTimeout(this.circleImg, timeout);
    }
}
let imigCircle = new ImgCircle({
    where_paste: document.getElementById('root'),
    array_img  : arr_img_circle,
    timeout    : 5000,
    method_paste:'append',
});







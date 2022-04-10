class ShowImiges {
    arrayDataKeys = [ "next", "prev", "container", "main"];
    elements = null;
    deleteHandlers =[];
    constructor({
                    classes = {
                        main:['container'],
                        next:['next'],
                        prev:['prev'],
                        container:['incontainer'],
                        imges:['img'],
                        none :['none'],
                    },
                    arrow = {
                        next:"./arrow/strelka1.png",
                        prev:"./arrow/strelka2.png",
                    },
                    imiges =[
                        ["./assets/Beach1.jpg",'море'],
                        ["./assets/Beach2.jpg","море"],
                        ["./assets/Beach3.jpg","море"],
                        ["./assets/more3.jpg","море"],
                        ["./assets/more2.jpg","море"],
                        ["./assets/more.jpg","море"],
                        ["./assets/Sun.jpg","море"],
                        ["./assets/tropical.jpg","море"],
                        ["./assets/Mainbeach.jpg","море"],
                    ],
                    wherePaste = document.getElementById('root'), // Dom-element
                    methodPaste ='append', // prepend, append, before, after
                } = {}) {
        this.classes = classes;
        this.arrow = arrow;
        this.imiges = imiges;
        this.wherePaste = wherePaste;
        this.methodPaste = methodPaste;
        if (this.wherePaste && Element.prototype[this.methodPaste]) {
            this.wherePaste[this.methodPaste](this.createHtml(this.classes, this.arrow, this.imiges));
        } else {
            throw new Error('Неправильный метод для вставки или элемент для вставки не обнаружен');
        }
        this.elements = this.findElements(document.body,this.arrayDataKeys);
        this.onloadsize();
        this.transitionSize();
        this.elements.next.onclick = this.nextOnClick();
        this.elements.prev.onclick = this.prevOnClick();
    }
    transitionSize() {
        let resize = (event) => {
            console.log(event);
             if (this.elements.container && this.elements.container.children.length) {
                    let  img = this.elements.container.children[0];
                    this.elements.container.scrollLeft =
                    img.offsetWidth * Math.round(this.elements.container.scrollLeft/img.offsetWidth);
             }
            // this.elements.container.scrollLeft =
            // this.elements.container.offsetWidth * Math.round(this.elements.container.scrollLeft/this.elements.container.offsetWidth);

        };
        document.addEventListener('transitionend', resize);
        this.deleteHandlers.push({
            'transitionend': resize,
        });
    }
    deleteComponent () {
        this.deleteHandlers.forEach((obj) => {
            Object.entries(obj).forEach(([event, handler]) => {
               document.removeEventListener(event, handler);
            });
        })
    }
    onloadsize() {
        window.onload = () => {
            this.sizeScroll();
            window.onload = null;
        }
    }
    createHtml(classes, arrow, imiges) {
        let showscrollImg = {
            div: {
                classes: classes.main,
                dataKey:[['main', ''],],
                imges:[
                    {
                        classes:classes.next,
                        next: arrow.next,
                    },
                    {
                        classes: [classes.prev,...classes.none],
                        prev:arrow.prev,
                    },
                ],
                div:{
                    classes:classes.container,
                    dataKey:[['container', '']],
                    imgesMany:[
                        {
                            classes:classes.imges,
                            imges:imiges,
                        }
                    ],
                }
            }
        };
        let createHtmlObj = obj => {
            for( let [ key, value ] of Object.entries(obj)) {
                if (key === 'div' && typeof value === 'object') {
                    let div = document.createElement('div');
                    div.className =value.classes.join(' ');
                    this.setDataKey(div, value.dataKey);
                    if (value.imges  && Array.isArray(value.imges)) {
                        for (let img of value.imges) {
                            if (typeof img === 'object') {
                                let { classes, next, prev } = img;
                                let imgObj = document.createElement('img');
                                imgObj.className = classes.join(' ');
                                next ? imgObj.dataset['next'] ='' : imgObj.dataset['prev'] ='';
                                next ? imgObj.src = next: imgObj.src = prev;
                                //---------------------------------
                                div.append(imgObj);
                            }
                        }
                    }
                    if (value.imgesMany && Array.isArray(value.imgesMany)) {
                        for (let img of value.imgesMany) {
                            let { classes, imges } = img;
                            Array.isArray(imges) && imges.forEach(([src, alt]) => {
                                let img = document.createElement('img');
                                img.className = classes.join(' ');
                                img.src = src;
                                img.alt = alt;
                                div.append(img);
                            });
                        }
                    }
                    let div_in = createHtmlObj(value);
                    div_in ? div.append(div_in): void(0);
                    return div;
                }
            }
        };
        return createHtmlObj(showscrollImg);
    }
    setDataKey(objHtml, arrayDataKey) {
        arrayDataKey.forEach(([dataKey, value]) => {
            if (!objHtml.dataset.dataKey) {
                objHtml.dataset[dataKey] = value;
            }
        })
    }
    findOfDataset (root,keyOfDataset) {
        if (root.dataset[keyOfDataset] !== undefined) {
            return root;
        }
        if (root.children.length) {
            for (let children of root.children) {
                //console.log(children);
                let element = this.findOfDataset(children, keyOfDataset);
                if (element) {
                    return element;
                }
            }
        }
    }
    findElements(root,array) {
        return array.reduce((accum, dataKey) => {
            let element = this.findOfDataset(root, dataKey);
            element ? accum[dataKey] = element : console.log(`Элемент ${ dataKey }  не найден`);
            return accum;
        },{});
    }
    sizeScroll() {
        if (this.elements.container.scrollLeft ===
           (this.elements.container.scrollWidth - this.elements.container.clientWidth )){
             this.elements.next.classList.add(...this.classes.none);
        } else  {
            this.elements.next.classList.remove(...this.classes.none);
        }
        if (!this.elements.container.scrollLeft) {
            this.elements.prev.classList.add(...this.classes.none);
        }
        if (this.elements.container.scrollLeft) {
            this.elements.prev.classList.remove(...this.classes.none);
        }
    }
    nextOnClick () {
        return () => {
            this.elements.container.scrollLeft += this.elements.container.offsetWidth;
            // this.elements.container.scrollLeft += this.elements.container.clientWidth;
            this.sizeScroll();
        };
    }
    prevOnClick() {
        return  () => {
            this.elements.container.scrollLeft -= this.elements.container.offsetWidth;
            // this.elements.container.scrollLeft -= this.elements.container.clientWidth;
            this.sizeScroll();
        };
    }
}
let showImiges = new ShowImiges();
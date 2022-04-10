let options =[
    {
        value: "",
        text:"Невыбрано",

    },
    {
        value: "1",
        text:"Audi",

    },
    {
        value: "2",
        text:"BMW",

    },
    {
        value: "3",
        text:"Citroen",

    },
    {
        value: "4",
        text:"Ford",

    },
    {
        value: "5",
        text:"Jaguar",

    },
    {
        value: "6",
        text:"Land Rover",

    },
    {
        value: "7",
        text:"Ford",

    },
    {
        value: "8",
        text:"Mercedes",

    },
    {
        value: "9",
        text:"Mini",

    },
    {
        value: "10",
        text:"Nissan",

    },
    {
        value: "11",
        text:"Toyota",

    },
    {
        value: "12",
        text:"Volvo",

    },
]
class CustomSelect {
    delete_handlers ={ };
    animation = false;
    enter = false;
    htmlEl = null;
    animationNameOut = "animatezoom_out";
    hide_cl = "custom-select__select-items_hide";
    active_cl ="custom-select__selected_active";
    classes = {
        root_cl :[
            "custom-select",
            "root__custom-select"
        ],
        select_cl:["custom-select__select"],
        selected_cl:[
            "custom-select__selected ",
            "custom-select__selected_bxshadow",
            "custom-select__selected_theme",
            "custom-select__selected_size",
        ],
        sp_value_cl:[
            "custom-select__span-text"
        ],
        container_cl:[
            "custom-select__select-items",
            "custom-select__select-items_pos",
            "custom-select__select-items_theme",
            "custom-select__select-items_size",
            "custom-select__select-items_hide",
            "custom-select__select-items_bxshadow",
        ],
        item_cl:[
            "custom-select__select-item",
            "custom-select__selected_size"
        ],
        animate_cl:[
            "animate-enter",
            "animate-out",
        ],
    }
    structurs = {
        options_str : [],
        divs_str : [
            {
                className: this.classes.root_cl,
            },
            {
                className: this.classes.selected_cl,
            },
            {
                className: this.classes.container_cl,
            },
        ],
        select_str :[
            {
                className: this.classes.select_cl,
                name:"custom-select",
            },
        ],
        span_str:[
            {
                className:this.classes.sp_value_cl,
            },
        ],
    };
    constructor({
                    options = options,
                    animation = false,
                    wherePaste = document.body,
                    methodPaste = "append",
                    animationNameOut ="",
                    hide_cl ="",
                    active_cl = "",

                } = {}) {
        this.structurs.options_str = options;
        if (!this.structurs.options_str) {
            console.log("Передайте массив опций");
            return;
        }
        this.animationNameOut = (animationNameOut ? animationNameOut :this.animationNameOut);
        this.hide_cl = hide_cl ? hide_cl :this.hide_cl;
        this.active_cl = active_cl ? active_cl :this.active_cl;
        this.animation = animation;
        this.wherePaste = wherePaste;
        this.methodPaste = methodPaste;
        this.htmlEl = this.createHtmlEl(this.structurs, this.classes);
        this.addListeners();
        if (this.wherePaste instanceof Element && Element.prototype[this.methodPaste]) {
            this.wherePaste[this.methodPaste](this.htmlEl.rootDivTag);
        }
    }
    addListeners() {
        let animation = this.animation;
        let htmlEl = this.htmlEl;
        let removeAddClassCycle = this.removeAddClassCycle;
        let enter = this.enter;
        let map = htmlEl.mapForHandler;
        let selected = htmlEl.selectedDivTag;
        let container = htmlEl.containerDivTag;
        let span = htmlEl.span;
        let divItems = htmlEl.itemsDivTags;
        let anymationNameOut = this.animationNameOut;
        let [enter_an, out_an] = this.classes.animate_cl;
        let active = this.active_cl;
        let hide = this.hide_cl;
        let for_delete = this.delete_handlers;

        if (animation) {
            document.addEventListener("animationend", function an({ animationName, type })  {
                if (!(type in for_delete)) {
                    for_delete[type] = an;
                }
                if (animationName === anymationNameOut) {
                    container.classList.add(hide);
                }
            });
        }
        document.addEventListener("click", function click({ target, type })  {
            if (!(type in for_delete)) {
                for_delete[type] = click;
            }
            if (target === selected || target === span) {
                enter = true;
                if (animation) {
                    selected.classList.toggle(active);
                    if (divItems[0].classList.contains(enter_an)) {
                        removeAddClassCycle(divItems, enter_an, out_an);
                    } else {
                        removeAddClassCycle(divItems, out_an, enter_an);
                        container.classList.remove(hide);
                    }
                } else {
                    selected.classList.toggle(active);
                    container.classList.toggle(hide);
                }
            }
            if (map.has(target) ) {
                let option = map.get(target);
                option.selected = true;
                span.textContent = option.text;
                if (animation) {
                    removeAddClassCycle(divItems, enter_an,out_an);
                } else {
                    selected.classList.remove(active);
                    container.classList.add(hide);
                }
                enter = false;
            }
            if (!map.has(target) && !(target === selected) && !(target === span) && enter) {
                if (animation) {
                    removeAddClassCycle(divItems, enter_an,out_an);
                } else {
                    selected.classList.remove(active);
                    container.classList.add(hide);
                }
                enter = false;
            }
        });
    }
    createHtmlEl(str,classes) {
        let createTagIndex =  this.createTagIndex.bind(this);
        let pasteElements  =  this.pasteElements.bind(this);
        let createDivs     =  this.createDivs.bind(this);

        let selectTag = createTagIndex("select",str.select_str)[0];
        let optionsTags = createTagIndex("option", str.options_str);
        let [mapForHandler, itemsDivTags] = createDivs(optionsTags, classes.item_cl);
        let [rootDivTag, selectedDivTag, containerDivTag] = createTagIndex("div",str.divs_str);
        let span = createTagIndex("span", str.span_str)[0];
        pasteElements(selectTag, optionsTags);

        span.textContent = selectTag.options[selectTag.selectedIndex].text;
        pasteElements(containerDivTag,itemsDivTags);
        pasteElements(selectedDivTag, span);
        pasteElements(selectedDivTag, containerDivTag);
        pasteElements(rootDivTag,[selectTag,selectedDivTag]);
        return {
            selectTag,
            optionsTags,
            rootDivTag,
            selectedDivTag,
            span,
            containerDivTag,
            itemsDivTags,
            mapForHandler,
        };
    }
    createTagIndex(tag, arrayAttr, index = 0) {
        let array_tag = [];
        if (index === arrayAttr.length) {
            return array_tag;
        }
        let created_tag = document.createElement(tag);
        let attr = arrayAttr[index];
        for (let key of Object.keys(attr)) {
            if (Array.isArray(attr[key]) && key === "className") {
                created_tag[key] = attr[key].join(" ");
                continue;
            }
            created_tag[key] = attr[key];
        }
        array_tag.push(created_tag, ...this.createTagIndex(tag,arrayAttr, index +1));
        return  array_tag;
    }
    createDivs(arrOptions = [], arr_cl = []) {
        let map = new Map();
        let div_items = arrOptions.map((option) => {
            let div = document.createElement("div");
            div.textContent = option.text;
            div.className = arr_cl.join(' ');
            map.set(div, option);
            return div;
        });
        return [ map, div_items];
    }
    pasteElements(parent, child) {
        if (parent instanceof Element && child instanceof Element) {
            parent.append(child);
        } else if (parent instanceof Element && Array.isArray(child)) {
            parent.append(...child);
        }
    }
    removeAddClassCycle(arrHtmlEl, class_remove, class_add) {
        arrHtmlEl.forEach(div => {
            div.classList.remove(class_remove);
            div.classList.add(class_add);
        });
    }
    deleteHandlers() {
        this.delete_handlers.forEach(([event, handler]) => {
           document.removeEventListener(event, handler);
        });
    }
}
new CustomSelect({
    wherePaste: document.getElementById("root"),
    options: options,
    animation:true,
});

function findOwnElementByDataKey(dataKey, root) { // поиск одного объекта по дата-ключу
    if ( dataKey in root.dataset) {
        return root;
    }
    if ( root.children.length) {
        for (let child of root.children) {
            let element = findOwnElementByDataKey(dataKey,child);
            if (element) {
                return element ;
            }
        }
    }
}
function getChildrenByHTMLElement({
  root = document.body,
  count = 0,
  counterChildren = false,
  isReturndMap    = false,
  isChildrenSet   = false,
  firstElement = null
} = {}) {
    if (!count) { // первый вызов
        getChildrenByHTMLElement.result = {};
        getChildrenByHTMLElement.getObjElementsWithDataAtr = (obj_for_records,dataSetKeys, root) => {
            if (dataSetKeys.length) {
                dataSetKeys.forEach(key => {
                    let element = {
                        element: root,
                        value  : root.dataset[key],
                    };
                    if (getChildrenByHTMLElement[obj_for_records][key]) {
                        if (Array.isArray(getChildrenByHTMLElement[obj_for_records][key])) {
                            getChildrenByHTMLElement[obj_for_records][key].push(element);
                        } else {
                            getChildrenByHTMLElement[obj_for_records][key] =[getChildrenByHTMLElement[obj_for_records][key]];
                            getChildrenByHTMLElement[obj_for_records][key].push(element);
                        }
                    } else {
                        getChildrenByHTMLElement[obj_for_records][key] = element;
                    }
                });
            }
        };
    }
    if (!counterChildren) {
        let dataSetKeys = Object.keys(root.dataset);
        if (dataSetKeys.length) {
            dataSetKeys.forEach((key) => {
                getChildrenByHTMLElement.allElementsWithDataAtr ={};
                getChildrenByHTMLElement.StreightElementsWithDataAtr ={};
                let result = {
                    parent: root,
                    children: getChildrenByHTMLElement({
                        root,
                        count: count+1,
                        counterChildren:true,
                        firstElement : root,
                    }),
                    allElementsWithDataAtr:getChildrenByHTMLElement.allElementsWithDataAtr,
                    StreightElementsWithDataAtr:getChildrenByHTMLElement.StreightElementsWithDataAtr,
                    value: root.dataset[key],
                    detail:{},
                    repeatKey: new Map(),// повторяющиеся ключи.
                };
                if (key in getChildrenByHTMLElement.result) {
                    getChildrenByHTMLElement.result[key].repeatKey.set(root,result);
                } else {
                    getChildrenByHTMLElement.result[key] = result;
                }
            });
        }
    }
    if (counterChildren) { // считаем детей.
        let array = [];
        let dataSetKeys = Object.keys(root.dataset);
        if (root !== firstElement) {
            array.push(root);
            getChildrenByHTMLElement.getObjElementsWithDataAtr('allElementsWithDataAtr',dataSetKeys,root);

        } else {
            [].forEach.call(root.children,(streightChild) => {
                dataSetKeys = Object.keys(streightChild.dataset);
                getChildrenByHTMLElement.getObjElementsWithDataAtr('StreightElementsWithDataAtr',dataSetKeys,streightChild);
            });
        }
        if (root.children.length) {
            for ( let child of root.children) {
                array.push(...getChildrenByHTMLElement({
                    root: child,
                    count: count + 1,
                    counterChildren,
                    firstElement
                }));
            }
        }
        return array;
    } else { // идем дальше по дереву.
        if (root.children.length)  {
            for ( let child of root.children) {
                getChildrenByHTMLElement({
                    root:child,
                    count:count + 1,
                    counterChildren,
                    firstElement
                });
            }
        }
        if (!count) { // заканчиваем первый вызов
            if (isChildrenSet) {
                Object.values(getChildrenByHTMLElement.result).forEach(result_obj => {
                    result_obj.children = new Set(result_obj.children);
                    if (result_obj.repeatKey.size) {
                        result_obj.repeatKey.forEach((value) => {
                            value.children = new Set(value.children);
                        });
                    }
                });
            }
            if (isReturndMap) {
                let map = new Map();
                Object.entries(getChildrenByHTMLElement.result).forEach(([ key,value]) => {
                    value.key = key;
                    map.set(value.parent, value);
                    if (value.repeatKey.size) {
                        value.repeatKey.forEach((value, key_obj) => {
                            value.key = key;
                            map.set(key_obj,value);
                        });
                    }
                });
                return  map;
            }
            return getChildrenByHTMLElement.result;
        }
    }
}
function addListeners({
    handler = '1',
    dataKeys_for_firstMenu = {
       menu: "menu_open",
       triangle: "triangle",
       popup:"popup",
    },
    dataKeys_for_menu_in = {
      menu:"menu_open2",
      triangle:"triangle",
      popup:"popup",
    },
    classes_for_firstMenu = {
      menu: "menu_menu-popup-hidden",
      popup: "menu_menu-popup-hidden",
      triangle: "triangle_rotate_180",
    },
    classes_for_menu_in = {
      menu: "menu_menu-popup-hidden",
      popup: "menu_menu-popup-hidden",
      triangle: "triangle-in_rotate_90",
    },
}={ }) {
    let menu = findOwnElementByDataKey('menu',document.body);
    let map = getChildrenByHTMLElement({
        root:menu,
        isChildrenSet:true,
        isReturndMap:true,
    });
    console.log(map);
    function addActive(target, classes, dataKeys,  handler = false) {
        if (!handler) {
            map.set("active", target);
        }
        let elements_for_classes = map.get(target).StreightElementsWithDataAtr;
        elements_for_classes[dataKeys.triangle].element.classList.add(classes.triangle);
        elements_for_classes[dataKeys.popup].element.classList.remove(classes.popup);
    }
    function removeActive(active,classes, dataKeys) {
        let elements_for_classes = map.get(active).StreightElementsWithDataAtr;
        elements_for_classes[dataKeys.triangle].element.classList.remove(classes.triangle);
        elements_for_classes[dataKeys.popup].element.classList.add(classes.popup);
    }
    function deleteActive() {
        map.delete("active");
    }

    function serchActiveElement(target,dataKeys,classes,serchUnderMenu = false) {
        map.forEach((value, key) => {

            if (value.key === dataKeys.menu) {
                Object.values(value.StreightElementsWithDataAtr).forEach(obj => {
                    if (obj.element === target ) {
                        if (!serchUnderMenu) {
                            addActive(key, classes,dataKeys);
                        } else {

                            addActive(key,classes,dataKeys,true)
                            addMenu_in(key);
                        }
                    }
                });
            }
        });
    }
    function addMenu_in(target) {
        if ("menu_in" in mouseMoveHandler && Array.isArray(mouseMoveHandler.menu_in)) {
            if(!mouseMoveHandler.menu_in.includes(target)) {
                mouseMoveHandler.menu_in.push(target);
            }
        } else {
            mouseMoveHandler.menu_in = [target];
        }
    }
    function debounce(func,event,delay) {
        let pause = false;
        let handler = (...arg) => {
            if (!pause) {
                func.call(this, ...arg);
                pause = true;
            }
            setTimeout(() => pause = false, delay);
        };
        debounce.for_delete_handler = {
            [event]:handler,
        };
        return handler;
    }
    function deleteHandler(obj) {
        Object.entries(obj).forEach(([event, handler]) => {
            document.removeEventListener(event, handler);
        });
    }
    function mouseMoveHandler({target}) {

        if (!map.has("active")) { // первый вход.
            if (map.has(target)) {
                if (map.get(target).key === "menu_open") { // навели на меню.
                    addActive(target,classes_for_firstMenu,dataKeys_for_firstMenu);
                } else { // открываем меню при наведении на элемент внутри меню (например треугольник).

                    serchActiveElement(target,dataKeys_for_firstMenu,classes_for_firstMenu);
                }
            }
        }
        if (map.has("active")) { // первый вход был выполнен.
            let active = map.get("active");
            if (map.has(target)) {
                if (target !== active && map.get(target).key === dataKeys_for_firstMenu.menu && !map.get(active).children.has(target)) { // переход на другое меню.
                    removeActive(active,classes_for_firstMenu,dataKeys_for_firstMenu);
                    addActive(target,classes_for_firstMenu,dataKeys_for_firstMenu);
                } else if(!map.get(active).children.has(target) && target !== active) { // переход на элемент другого меню (например треугольниик).
                    removeActive(active,classes_for_firstMenu,dataKeys_for_firstMenu);
                    serchActiveElement(target,dataKeys_for_firstMenu,classes_for_firstMenu);
                } else if (map.get(active).children.has(target) && map.get(target).key === dataKeys_for_menu_in.menu) { // переход на подменю.
                    addActive(target,classes_for_menu_in,dataKeys_for_menu_in,true);
                    addMenu_in(target);
                } else if(map.get(active).children.has(target)) { // переход на элемент  подменю (например треугольниик).
                    serchActiveElement(target,dataKeys_for_menu_in,classes_for_menu_in,true);
                }
            }

            // проверяем внутри ли подменю.
            if ("menu_in" in mouseMoveHandler && Array.isArray(mouseMoveHandler.menu_in) && mouseMoveHandler.menu_in.length ) {
                for (let counter = mouseMoveHandler.menu_in.length - 1; counter >= 0; counter--) {
                    let children = map.get(mouseMoveHandler.menu_in[counter]).children;
                    if (target !== mouseMoveHandler.menu_in[counter] && !children.has(target)) {
                        removeActive(mouseMoveHandler.menu_in[counter],classes_for_menu_in,dataKeys_for_menu_in);
                        mouseMoveHandler.menu_in.length--;
                    }
                }

            }
            if (map.get(active).children.has(target) || target === active) { //переход внутри меню.
                return;
            }
            if (!map.has(target) || target === menu) { //уходим с меню.
                removeActive(active,classes_for_firstMenu,dataKeys_for_firstMenu);
                deleteActive();
                if (mouseMoveHandler.menu_in) {
                    delete  mouseMoveHandler.menu_in;
                }
            }
        }
    }
    if ( handler === "1") {
        document.addEventListener("mousemove", debounce(mouseMoveHandler,"mousemove",0));
    } else {
        // или  намного проще.....
        map.forEach((value, key) => {
            if (value.key === dataKeys_for_firstMenu.menu ) {

                key.onmouseenter = () => {
                    addActive(key,classes_for_firstMenu,dataKeys_for_firstMenu,true);
                }
                key.onmouseleave = () => {
                    removeActive(key,classes_for_firstMenu,dataKeys_for_firstMenu);
                }
            } else if( value.key === dataKeys_for_menu_in.menu) {

                key.onmouseenter = () => {
                    addActive(key,classes_for_menu_in, dataKeys_for_menu_in,true);
                }
                key.onmouseleave = () => {
                    removeActive(key,classes_for_menu_in,dataKeys_for_menu_in);
                }
            }
        });
    }
    document.getElementById("button").onclick = () => {
        deleteHandler(debounce.for_delete_handler);
    };
}
addListeners( {
    handler:"1",
});
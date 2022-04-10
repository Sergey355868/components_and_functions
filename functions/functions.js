let text = ['1','2','3','4','5'];
//--------------------------------------------------------------------------------------
function createTagWithContextText(arrayOfContextText, tag, index = 0) {
    if (index === arrayOfContextText.length) {
        return [];
    }
    let tag_in = document.createElement(tag);
    tag_in.textContent = arrayOfContextText[index];
    let arr = [tag_in];
    arr.push(...createTagWithContextText(arrayOfContextText,tag, index +1));
    if (arr.length === arrayOfContextText.length) {
        console.log('Все элементы добавлены.');
        // или .....
    }
    return arr;
    //return  [div].concat(createTagWithContextText(arrayOfContextText,tag, index +1));
}
//---------------------------------------------------------------------------------------
// document.body.append(...createTagWithContextText(text,'div'));

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function findElementsByDataKey(root, array, countCall = 0) {
    let in_array =[];
    if (!countCall) {
        findElementsByDataKey.firstElement = root;
    }
    array.forEach(dataKey => {
        if (root.dataset[dataKey] !== undefined) {
            in_array.push([dataKey,root]);
        }
    });
    if (root.children.length) {
        for (let child of root.children) {
            in_array.push(...findElementsByDataKey(child, array,  countCall +1));
        }
    }
    if (root === findElementsByDataKey.firstElement ) {
       return  Object.fromEntries(in_array);
    }
    return in_array;
}
//----------------------------------------------------------------------------------------------------------------------
function findElementsByDataKeyOpt(root,array,countCall = 0) {
    if (!countCall) { // при первом заходе  устанавливаем необходимы свойства.
        findElementsByDataKeyOpt.obj_elements = {};
        findElementsByDataKeyOpt.firstElement = root;
        findElementsByDataKeyOpt.filtredArray = [];
        findElementsByDataKeyOpt.isSerching = true;
    }
    for (let dataKey of array) {
        if (dataKey in root.dataset) {
           findElementsByDataKeyOpt.obj_elements[dataKey] = root;
           array = array.filter(dataKey => !findElementsByDataKeyOpt.obj_elements[dataKey]);
           findElementsByDataKeyOpt.filtredArray = array;
           if (!array.length) {
              findElementsByDataKeyOpt.isSerching = false;
              return;
           }
        }
    }
   // console.log('serching', root);
    if (root.children.length) { // идем по структуре тегов.
        for (let child of root.children) {
            if (findElementsByDataKeyOpt.isSerching) {
                findElementsByDataKeyOpt(child, array, countCall +1);
            } else {
                //console.log('return', child);
                return ;
            }
        }
    }
    //console.log('after', root);
    // первый вызов
    if (findElementsByDataKeyOpt.firstElement === root && !countCall) {
        return !findElementsByDataKeyOpt.filtredArray.length
        ? findElementsByDataKeyOpt.obj_elements
        : findElementsByDataKeyOpt.filtredArray.length === 1
          ? console.log(` элемент ${ findElementsByDataKeyOpt.filtredArray.toString() }  не был найден`)
          : console.log(` элементы ${ findElementsByDataKeyOpt.filtredArray.toString() }  не были найдены`);
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function  getChildrenFromObjectElements({ // передаем объект в формате { key: htmlObject } и необходимые флаги;
obj_with_elements = {},
isReturnMap = false,
isChildrenSet = false,
root = null,
countCall = 0, 
result = {} } = {}) {
    if (!countCall) { // заходим первый раз.
        getChildrenFromObjectElements.chekingProperty = (nameObjWithProperty, key, root) => {
            if (getChildrenFromObjectElements[nameObjWithProperty][key]) {
                getChildrenFromObjectElements[nameObjWithProperty][key].push(root);
            } else {
                getChildrenFromObjectElements[nameObjWithProperty][key] = [root];
            }
        };
        Object.entries(obj_with_elements).forEach(([key, html_obj]) => {
            getChildrenFromObjectElements.parent = html_obj;
            getChildrenFromObjectElements.endChildren = {};
            getChildrenFromObjectElements.firstChildren = {};
            getChildrenFromObjectElements.elementsByDataKey = {};
            getChildrenFromObjectElements.orderOfCalls = [];
            result[key] = {
              parent:html_obj,
              allChildren:getChildrenFromObjectElements({
                      root:html_obj,
                      countCall: countCall + 1,
              }),
              firstChildren: getChildrenFromObjectElements.firstChildren,
              endChildren: getChildrenFromObjectElements.endChildren,
              elementsByDataKey: getChildrenFromObjectElements.elementsByDataKey,
              orderOfCalls: getChildrenFromObjectElements.orderOfCalls ,
              deepRecursForOwnElement:  getChildrenFromObjectElements.orderOfCalls.length,
            };
            if (Array.isArray(result[key].allChildren)) {
                result[key].sumChildren = result[key].allChildren.length;
                if (isChildrenSet) {
                  result[key].allChildren = new Set(result[key].allChildren);
                }
            }
        });
        if (isReturnMap) {
            let map = new Map();
            Object.values(result).forEach((result_obj) => {
                 map.set(result_obj.parent, result_obj);
            });
            return  map;
        }
        return  result;
    } else {
        getChildrenFromObjectElements.orderOfCalls.push(countCall);
        let array = [];
        let arrayKeysOfDataSetObject = Object.keys(root.dataset);

        if (root !== getChildrenFromObjectElements.parent) { // записываем детей
           array.push(root);
           if (arrayKeysOfDataSetObject.length) {
                 arrayKeysOfDataSetObject.forEach((key) => {
                     getChildrenFromObjectElements.chekingProperty('elementsByDataKey',key,root);
                 });
           }
        } else  { // первые дети.
            if (!getChildrenFromObjectElements.firstChildren.allFirstChildren) {
                getChildrenFromObjectElements.firstChildren.allFirstChildren = [...root.children];
            }
            if( Array.isArray(getChildrenFromObjectElements.firstChildren.allFirstChildren)) {
                getChildrenFromObjectElements.firstChildren.allFirstChildren.forEach((firstElement) => {
                   getChildrenFromObjectElements.chekingProperty('firstChildren',firstElement.tagName,root);
                });
            }
        }
        if (root.children.length) {
            for (let child of root.children) {
                array.push(...getChildrenFromObjectElements({
                    root:child,
                    countCall: countCall+ 1,
                }));
            }
        } else { // записываем конечные элементы
            getChildrenFromObjectElements.chekingProperty('endChildren','allEndElements', root);
            getChildrenFromObjectElements.chekingProperty('endChildren', root.tagName, root);
        }
        return array;
    }
}
//----------------------------------------------------------------------------------------------------------------------
function getChildrenByHTMLElement({
root = document.body,
count = 0,
counterChildren = false,
isReturndMap    = false,
isChildrenSet   = false,
firstElement = null } = {}) {
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
//--------------------------------------------------------
//--------------------------------------------------------
// testing functions
//------------------
console.log(getChildrenByHTMLElement({
    root: document.body,
    isReturndMap:true,
    isChildrenSet:true,
}));
// let obj15 = {};
// let array= ["button1","button2", "button3", "button4", "button5"];
// let array2 =["button1"];
// //console.log(findElementByDataKey(document.body,array));
// console.log(findElementsByDataKeyOpt(document.body,array));
// let last = document.getElementById('last');
// let test = {
//    body : document.body,
//    last : last,
// };
//  let answer = getChildrenFromObjectElements({
//      obj_with_elements:test,
//      isReturnMap:true,
//      isChildrenSet:true,
//  });
//  console.log(answer);
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
let arrayAtr = [
    {
        href:"#",
        textContent:"Главная",
        className:[],
    },
    {
        href:"#",
        textContent:"Магазин",
        className: [],
    },
    {
        href:"#",
        textContent:"О нас",
        className: [],
    },
];
function createTag(tagName, arrayAttributse) {
    let array_ready_tags = [];
    if (arrayAttributse.length) {
        let tag = document.createElement(tagName);
        //let attr = arrayAttributse.shift();
        let attr = arrayAttributse.pop();
        for (let key of Object.keys(attr)) {
            if (Array.isArray(attr[key]) && key === "className") {
                tag[key] = attr[key].join(" ");
                continue;
            }
            tag[key] = attr[key];
        }
        //array_ready_tags.push(tag, ...createTag(tagName, arrayAttributse));
        array_ready_tags.push(...createTag(tagName, arrayAttributse), tag);
    }
    return  array_ready_tags;
}
//document.body.append(...createTag("a",arrayAtr));
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
let options = [
    {
        value: "",
        text:"Выберите авто:",
        class:["custom-select__select-item"],
    },
    {
        value: "",
        text:"Audi",
        class:["custom-select__select-item"],
    },
    {
        value: "",
        text:"BMW",
        class:["custom-select__select-item"],
    },
];
function createTagIndex(tag, arrayAttr, index = 0) {
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
    array_tag.push(created_tag, ...createTagIndex(tag,arrayAttr, index +1));
    return  array_tag;
}
// testing function
//  console.log(createTagIndex("option", options));
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// функция нахождения первого элемента(передаем функцию 1)  и относительно его вторго элемента(передаем функцию 2)
function createMapElement1Element2(htmlElement, funcForSerchElement1,  funcForSerchElement2, keyMap = null,
countCall = 0, map = new Map()) {

    if (funcForSerchElement2(htmlElement) && keyMap) {
        map.get(keyMap).push(htmlElement);
    }
    if (funcForSerchElement1(htmlElement) && !keyMap) {
        map.set(htmlElement, []);
        createMapElement1Element2(htmlElement,funcForSerchElement1,funcForSerchElement2, htmlElement,
        countCall + 1, map);
    }
    if (htmlElement.children.length) {
        for (let child of htmlElement.children) {
            createMapElement1Element2(child, funcForSerchElement1, funcForSerchElement2, keyMap,
            countCall + 1, map);
        }
    }
    if (!countCall) {
        return map;
    }
}
// example
// функция для нахождения первого элемента.
// function funcForSerchElement1(htmlElement) { //должна возвращать булево значение
//     return htmlElement.tagName === "LI";
// }
// фу-я для нахождения второго элемента относительно первого(вложенного в первый);
// function funcForSerchElement2(htmlElement) { //должна возвращать булево значение
//     return htmlElement.tagName === "A";
// }
// call function
// createMapElement1Element2(document.body, funcForSerchElement1, funcForSerchElement2);
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// поиск элемента по условию функции.
function serchHtmlElements(htmlElement, funcForSerch) {
    let arrayForElement = [];
    if (funcForSerch(htmlElement)) {
        arrayForElement.push(htmlElement);
    }
    if (htmlElement.children.length) {
        for (let child of htmlElement.children) {
            arrayForElement.push(...serchHtmlElements(child, funcForSerch));
        }
    }
    return arrayForElement;
}
// пример функций поиска.
// function funcForSearch(htmlElement) {
//     return (htmlElement.tagName ==="LI" && !htmlElement.children.length);
// }
// function funcForSearchUL(htmlElement) {
//     return htmlElement.tagName ==="UL";
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
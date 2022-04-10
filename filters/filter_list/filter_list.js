
let filter_list = findOwnElementByDataKey(camelCaseDataKey("data-filter-list"), document.body);
let input_filter_list = findOwnElementByDataKey(camelCaseDataKey("data-input-filter-list"), filter_list);
let map  = createMapElement1Element2(filter_list, funcForSerchElement1, funcForSerchElement2);

input_filter_list.oninput = ({ target: { value } }) => {
    map.forEach((array, li ) => {
        let aTextValue = array[0].textContent || array[0].innerText;
        if (isCompareWords(value, aTextValue, false) || !value) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
        //  if (aTextValue.toUpperCase().indexOf(value) > -1) {
        //      li.style.display = "";
        //  } else  {
        //      li.style.display = "none";
        //  }
    });
};

function findOwnElementByDataKey(dataKey, root) {
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

function camelCaseDataKey(dataKey) {
    let index = 0;
    return dataKey.replace(/\b\w+\b/gi, match => {
        index++;
        if (index === 1 ) {
            return "";
        }
        if (index > 2) {
            match = match[0].toUpperCase() + match.slice(1);
        }
        return match;
    }).replace(/[- ]/g,"");
}

function createMapElement1Element2(htmlElement, funcForSerchElement1,  funcForSerchElement2, keyMap = null,
countCall = 0, map = new Map()) {

    if (funcForSerchElement2(htmlElement) && keyMap) {
        map.get(keyMap).push(htmlElement);
    }
    if (funcForSerchElement1(htmlElement) && !keyMap) {
        map.set(htmlElement, []);
        createMapElement1Element2(htmlElement, funcForSerchElement1, funcForSerchElement2, htmlElement,
        countCall + 1,map);
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

function isCompareWords(first_word, second_word, register = true) {
    if (!first_word || !second_word) {
        return  false;
    }
    if (!register) {
        first_word = first_word.toLowerCase();
        second_word = second_word.toLowerCase();
    }
    for (let i = 0; i < first_word.length; i++) {
        if (first_word[i] !== second_word[i]) {
            return false;
        }
    }
    return true;
}

function funcForSerchElement1(htmlElement) { // функция для нахождения первого элемента.
    return htmlElement.tagName === "LI";
}

function funcForSerchElement2(htmlElement) {// фу-я для нахождения второго элемента относительно
    return htmlElement.tagName === "A";    // первого(вложенного в первый);
}
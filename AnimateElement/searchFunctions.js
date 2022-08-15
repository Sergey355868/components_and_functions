function  SerchElements({
    entry = document.body,
    firstElement = null,
    funcSerchFirstElement = () => {},
    funcSerchElements = () => {},
    accum = null,
    count = 0,
    abort = true,
    optimization = {
       abort:true,
       custom:customAbort,
   },
 } = { }) {
    if(funcSerchFirstElement(entry,accum) && !firstElement) {
        let result = SerchElements({
            entry,
            firstElement:entry,
            funcSerchFirstElement,
            funcSerchElements,
            accum,
            count: ++count,
            optimization,
        });
        if (optimization.abort || result) {
            return accum;
        }
    }
    if (firstElement) {
        funcSerchElements(accum, firstElement, entry)
        if (optimization.custom && typeof  optimization.custom === "function" && customAbort(accum,firstElement,entry)) {
            return  accum;
        }
    }
    if(entry.children.length) {
        for(let child of entry.children) {
            let result = SerchElements({
                entry:child,
                firstElement,
                funcSerchFirstElement,
                funcSerchElements,
                accum,
                count :++count,
                optimization,
            });
            if (result) {
                return  result;
            }
        }
    }
    if(!count) {
        return accum;
    }
}
function  customAbort(accum,firstElement,entry ) {
    return Object.keys(accum).length === 7;
}
function searchfirstElement(htmlElement, accum) { // элемент относительно которого продолжим поиск.
    let { dataset  } = htmlElement;
    let key = toCamelCase("menu-burger-an");
    if (key in dataset) {
        accum[key] = htmlElement;
        return true;
    } else {
        return  false;
    }
}
function searchOthersElements(accum,firstElement,htmlElement) { // находим остальные элементы относительно первого.
    if (_typeof(accum) === "object") {
        ["overlay","button-an","top","middle","bottom","contaner-items"]
            .map(key => toCamelCase(key))
            .filter(key => !accum[key])
            .forEach(key =>(key in htmlElement.dataset) && (accum[key] = htmlElement));
    }
}
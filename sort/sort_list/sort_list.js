let sortArray = serchHtmlElements(document.body, funcForSearch);
let list = serchHtmlElements(document.body,funcForSearchUL)[0];

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

function funcForSearch(htmlElement) {
    return (htmlElement.tagName ==="LI" && !htmlElement.children.length);
}

function funcForSearchUL(htmlElement) {
    return htmlElement.tagName ==="UL";
}

function sortList () {
    if (!("dir" in sortList)) {
        sortList.dir ="asc";
    }
    if (sortList.dir ==="asc") {
        sortArray.sort((li1,li2) => li1.textContent.localeCompare(li2.textContent));
        sortList.dir ="desc";
    } else if (sortList.dir ==="desc") {
        sortArray.sort((li1,li2) => li1.textContent.localeCompare(li2.textContent) === -1 ? 1 : -1);
        sortList.dir ="asc";
    }
    list.append(...sortArray);
}
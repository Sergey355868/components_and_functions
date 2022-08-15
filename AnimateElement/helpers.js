function _typeof(data) {
    return Object.prototype.toString.call(data).match(/\w+/g)[1].toLowerCase();
}
function toCamelCase(string) {
    return string.replace(/-[a-z]/g, match => match[1].toUpperCase());
}
function getFixedCoordElement(coord, element) {
    return Number(element.getBoundingClientRect()[coord].toFixed(2));
}
function getStylePropertiesFromCSS(property, element) {
    let _property = getComputedStyle(element)[property];
    let number = parseFloat(_property);
    if (isFinite(number)) {
        return  Number(number.toFixed(2));
    }  else {
        console.log("свойство",_property);
        console.log("parseFloat",number);
        return  number;
    }
}
function getTopForPositionFixed(percent) {
    let top = document.documentElement.clientHeight * (percent / 100);
    return Number(top.toFixed(2));
}
function getLeftForPositinFixed(percent) {
    let left = document.documentElement.clientWidth * (percent / 100);
    return Number(left.toFixed(2));
}
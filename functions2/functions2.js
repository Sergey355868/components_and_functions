"use strict";
let array = [1,2,3,4,5,6,8,9,10];
let array2= [10,9,8,7,6,5,4,3,2,1,0];
let array3 = [1,2,1,3,1,4,5,6,3,2,1];

//----------------------------------------------------------------------------------------------------------------------
function getArraySortMax(array) {
    for (let first = 0; first< array.length -1; first++) {
        for (let second = first +1; second < array.length; second++) {
            if (array[first] < array[second]) {
                let replace = array[first];
                array[first] = array[second];
                array[second] = replace;
            }
        }
    }
    return array;
}
//----------------------------------------------------------------------------------------------------------------------
function getArraySortMaxRec(array, first= 0, second= 0, counter = 0) {
 if (!counter) {
     for  (let i = 0; i < array.length -1; i++) {
         getArraySortMaxRec(array,i,i+1, counter+1);
     }
     return array;
 } else {
     if (array[first] < array[second]) {
         let replace = array[first];
         array[first] = array[second];
         array[second] = replace;
     }
     if (second < array.length) {
         getArraySortMaxRec(array,first,second+1,counter+1);
     }
 }
}
//----------------------------------------------------------------------------------------------------------------------
function getArraySortMin(array) {
    for (let first = 0; first< array.length -1; first++) {
        for (let second = first +1; second < array.length; second++) {
            if (array[first] > array[second]) {
                let replace = array[first];
                array[first] = array[second];
                array[second] = replace;
            }
        }
    }
    return array;
}
//----------------------------------------------------------------------------------------------------------------------
function getArraySortEqual(array) {
    for (let first = 0; first< array.length -1; first++) {
        for (let second = first +1; second < array.length; second++) {
            if (array[first] === array[second]) {
                let replace = array[first + 1];
                array[first + 1] = array[second];
                array[second] = replace;
            }
        }
    }
    return array;
}
//----------------------------------------------------------------------------------------------------------------------
//console.log(getArraySortMaxRec(array))
// console.log(getArraySortMax(array3));
// console.log(getArraySortMin(array3));
// console.log(getArraySortEqual(array3));
//console.log(getArraySortMin(array3));
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// создание  копии объекта.
const user = {
    name:'Sergey',
    surname: null,
    adress: {
        street:'Lenina',
        city: null,
    },
}
const copyUser = { ...user, adress: { ...user.adress } };
// или
//----------------------------------------------------------------------------------------------------------------------
function copyObject(obj) {
    if (typeof obj !== "object" || obj === null) {
        return null;
    }
    return Object.keys(obj).reduce((accum,key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
            accum[key] = copyObject(obj[key]);
            return  accum;
        }
        accum[key] = obj[key];
        return  accum;
    }, {});
}

//console.log( copyObject(user));
//----------------------------------------------------------------------------------------------------------------------
//  или массива
let array_in = [
  "first",
  [1,2,3,4],
  [3,4,5,6],
  "second",
  "third",
  "forth"
];
//----------------------------------------------------------------------------------------------------------------------
function copyArray(array) {
    if (!Array.isArray(array)) {
        return  null;
    }
    return  array.reduce((accum,value, index) => {
        if (Array.isArray(value)) {
            accum[index] = copyArray(value);
            return accum;
        }
        accum[index] = value;
        return accum;
    },[]);
}
//----------------------------------------------------------------------------------------------------------------------
function _copyArray(array) {
  if (!Array.isArray(array)) {
        return  null;
  }
  let copy_array = [];
  for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
          copy_array[i] = _copyArray(array[i]);
      } else {
          copy_array[i] = array[i];
      }
  }
  return copy_array;
 }
// console.log(copyArray(array_in));
// console.log(_copyArray(array_in));
// console.log(array_in[1] === _copyArray(array_in)[1]);
//----------------------------------------------------------------------------------------------------------------------
// или вместе
const user2 = {
    name:'Sergey',
    surname: null,
    adress: {
        street:'Lenina'
    },
    friends:[
        {
          name: "Vladimir",
          surname: null,
          adress: {
              street:"Venina"
          },
          friends: [
              {
                name:"Kolia",
                surname:null,
                adress: {
                    street:"Petina",
                }
              }
          ]
        },
    ],
}
//----------------------------------------------------------------------------------------------------------------------
// копии с reduce.
function copyArrayAndObject(obj) {
    if (!Array.isArray(obj) && typeof obj !=="object" || obj === null ) {
        return null;
    } else if (typeof obj === "object" && !Array.isArray(obj)) {
        return Object.keys(obj).reduce((accum, key) => {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                accum[key] = copyArrayAndObject(obj[key]);
                return  accum;
            }
            accum[key] = obj[key];
            return  accum;
        }, {});
    } else if (Array.isArray(obj)) {
        return  obj.reduce((accum, value, index) => {
            if (typeof  value === "object" &&  value !== null) {
                accum[index] = copyArrayAndObject(value);
                return accum;
            }
            accum[index] = value;
            return accum;
        }, []);
    } else  {
        throw  new Error("Передайте в функцию массив или объект.");
    }
}
//console.log(copyArrayAndObject(user2));
//----------------------------------------------------------------------------------------------------------------------
function  factorial(number) {
 if (number === 1) {
     return number;
 }
  return number * factorial(number - 1);
}
//console.log(factorial(5));
//----------------------------------------------------------------------------------------------------------------------
function getSum (number) {
    if (number === 1) {
        return number;
    }
    return number + getSum(number - 1);
}
//console.log(getSum(5));
//----------------------------------------------------------------------------------------------------------------------
function numberN(number, n) {
 if (n ===1) {
     return number;
 }
 return  number * numberN(number,n-1);
}
//console.log(numberN(2,3));
//----------------------------------------------------------------------------------------------------------------------
let arrayTest = [1,2,4,9,32,40,50,60,61,100,120,140,160,170];
let arrayTest2 = [11];
let sortedArray = getArraySortMin(arrayTest);
//console.log(sortedArray);

//----------------------------------------------------------------------------------------------------------------------
function binarySerch(array, item) {
    let low = 0;
    let high = array.length - 1;
    while (low <= high) {
        let mid = Math.floor((low+high)/2);
        let guess = array[mid];
        if (guess === item) {
            return guess;
        }
        if (guess > item) {
            high = mid -1;
        }
        if (guess < item) {
            low = mid +1;
        }
    }
    return null;
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
let sym = Symbol('test');
let sym2 = Symbol('test2');
let obj = {
    key1:[{key1:"key1obj"}, ["key2"],"key3",sym2],
    key2:"key2",
    key3:"key3",
    key4: {
        key2_1:"key2_1",
        key2_2:"key2_2",
        key2_3:"key3_3",
        key2_4 : {
            key3_1: "key3_1",
            key3_2: "key3_2",
            Key3_3: "key3_3",
        },
    },
    [sym]:'Symbol',
    key5:{},
    key6:[]
};
//----------------------------------------------------------------------------------------------------------------------
// простая копия (без флагов и прототипов).
//----------------------------------------------------------------------------------------------------------------------
function getSimpleCopyObject(obj) {
    if (!Array.isArray(obj) && typeof obj !=="object" || obj === null ) {
        return null;
    }
    if (Array.isArray(obj)) {
        let newArray = [];
        for (let elementArray of obj) {
            if (typeof elementArray === "object" && elementArray !== null) {
                newArray.push(getSimpleCopyObject(elementArray));
                continue;
            }
            newArray.push(elementArray);
        }
        return  newArray;
    }
    if ( typeof obj === "object" && !Array.isArray(obj)) {
        let newObject = {};
        for (let key of Reflect.ownKeys(obj)) {
            let value = obj[key];
            if (typeof value === "object" && value !== null) {
                newObject[key] = getSimpleCopyObject(value);
                continue;
            }
            newObject[key] = value;
        }
        return newObject;
    }
}
//----------------------------------------------------------------------------------------------------------------------
// testing function getClone
// let obj2 = getSimpleCopyObject(obj);
// console.log(obj2);
// console.log(obj === obj2);
// console.log(obj.key1 === obj2.key1);
// console.log(obj.key4 === obj2.key4);
// console.log(obj.key1[1] === obj2.key1[1]);
// console.log(obj.key1[0] === obj2.key1[0]);
//----------------------------------------------------------------------------------------------------------------------
// копия с прототипами и флагами.
//----------------------------------------------------------------------------------------------------------------------
function getFullCopyObject(obj) {
    if (!Array.isArray(obj) && typeof obj !=="object" || obj === null ) {
        return null;
    }
    if (Array.isArray(obj)) {
        let newArray = [];
        for (let i = 0; i < obj.length; i++) {
            let elementArray = obj[i];
            if (typeof  elementArray === "object" && elementArray !== null) {
                newArray.push(getFullCopyObject(elementArray));
                continue;
            }
            newArray.push(elementArray);
        }
        return  newArray;
    }
    if (typeof obj === "object" && !Array.isArray(obj)) {
        let descriptors = Object.getOwnPropertyDescriptors(obj);
        if (Object.keys(obj).length) {
            let keys = Reflect.ownKeys(descriptors);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = descriptors[key].value;
                if (typeof value === "object" && value !== null) {
                    descriptors[key].value = getFullCopyObject(value);
                }
            }
        }
        return Object.create(Object.getPrototypeOf(obj), descriptors);
    }
}
//----------------------------------------------------------------------------------------------------------------------
// testing
// let obj2 = getFullCopyObject(obj);
// console.log(obj2);
// console.log(obj === obj2);
// console.log(obj.key1 === obj2.key1);
// console.log(obj.key4 === obj2.key4);
// console.log(obj.key1[1] === obj2.key1[1]);
// console.log(obj.key1[0] === obj2.key1[0]);
// console.log(obj.key5 === obj2.key5);
// console.log(obj.key6 === obj2.key6);
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
Array.prototype.my_concat = function () {
    let new_array = [];
    let for_copy = [...this, ...arguments];
    //console.log(for_copy);
    (function copy_to_new (for_copy) {
        for (let element of for_copy) {
            if (Array.isArray(element)) {
                copy_to_new(element);
                continue;
            }
            new_array[new_array.length] = element;
        }
    })(for_copy);
    return new_array;
}
//test
//console.log([[1,2],[3,4]].my_concat([[5,6],[7,8]]));
//----------------------------------------------------------------------------------------------------------------------
Array.prototype._my_concat = function () {
    function copy_to_new (for_copy) {
        let array = [];
        for (let element of for_copy) {
            if (Array.isArray(element)) {
                array.push(...copy_to_new(element));
                continue;
            }
            array.push(element);
        }
        return array;
    }
    return [...copy_to_new(this), ...copy_to_new(arguments)];
}
// testing
//console.log([[1,2],[3,4]]._my_concat([[5,6],[7,8]],9,10));
//console.log([1,2,3,4]._my_concat(5,6,7));
//----------------------------------------------------------------------------------------------------------------------
Array.prototype.my_find = function my_find (func) {
    if (!("index" in my_find)) {
        my_find.index = 0;
    } else {
        my_find.index++;
    }
    if (my_find.index === this.length ) {
        delete my_find.index;
        return null;
    }
    if (func(this[my_find.index],my_find.index,this)) {
        let index = my_find.index;
        delete my_find.index;
        return this[index];
    }
    return my_find.call(this,func);
}
// testing
//let arr = [5,5,6,7,20,2,1];
// console.log(arr.my_find((item) => {
//
//     return item === 1 })
// );
//----------------------------------------------------------------------------------------------------------------------
Array.prototype.my_filter = function my_filter (func,index = 0) {
 let new_array = [];
 if (index === this.length) {
     return new_array;
 }
 if (Array.isArray(this[index])) {
     new_array.push(my_filter.call(this[index], func, 0));
 }
 if (func(this[index], index, this) && !Array.isArray(this[index])) {
    new_array.push(this[index]);
 }
 new_array.push(...my_filter.call(this, func, index + 1));
 return  new_array;
 };
//testing function
// let arr2 = [1,[1,3],4,5,6,3,3,3,8,[1,2,3,4,[1,2,3,7,7,7]]];
// let filtred = arr2.my_filter(number => number !==3);
// console.log(filtred);
//----------------------------------------------------------------------------------------------------------------------
// точно определяет тип данных.
function my_typeof(data) {
    return Object.prototype.toString.call(data).match(/\w+/gi)[1].toLowerCase();
}
//testing function
// console.log(my_typeof(1));
// console.log(my_typeof("string"));
// console.log(my_typeof(new Map()));
// console.log(my_typeof(new Set()));
// console.log(my_typeof([]));
// console.log(my_typeof(() =>{}));
// console.log(my_typeof({}));
// console.log(my_typeof(Symbol("id")));
// console.log(my_typeof(new Promise(((resolve, reject) => {}))));
// console.log(my_typeof(new FormData));
// console.log(my_typeof(true));
//  console.log(my_typeof(null));
// console.log(my_typeof(undefined));
// console.log(my_typeof(new XMLHttpRequest()));
// console.log(my_typeof(window));
// console.log(my_typeof(new FileReader()));
// console.log(my_typeof(new Blob()));
// console.log(my_typeof( Reflect));
// console.log(my_typeof(new RegExp('')));
// console.log(my_typeof(new ArrayBuffer(10)));
///---------------------------------------------------------------------------------------------------------------------
// возвращает объект в абсолютных координатах(с прокруткой).
function getAbsoluteCords(htmlObj) {
    if (!htmlObj instanceof DOMRect ) {
        return  null;
    }
    let result = {};
    let fixedCoords = htmlObj.getBoundingClientRect();
    // let stringCoord = JSON.stringify(fixedCoords);
    JSON.stringify(fixedCoords).replace(/\b[xlr][a-z]*\b/g,(match, ...args) => {
        //console.log(args);
        //console.log(match);
        result[match] = fixedCoords[match] + pageXOffset;
        return "";
    }).replace(/\b[ytb][a-z]*\b/g,(match, ...args) => {
        //console.log(args);
        result[match] = fixedCoords[match] + pageYOffset;
        //console.log(match);
        return "";
    }).replace(/\b[wh][a-z]+\b/g,(match, ...args) => {
        //console.log(args)
        //console.log(match)
        result[match] = fixedCoords[match];
    });
    return result;
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// camelCase для  преф-в.
function camelCase(string) {
    return string.split("-") .filter (string => string)
        .map((string,index) => {
            return index === 0 ? string : string = string[0].toUpperCase() + string.slice(1);
        }) .join('');
}
//----------------------------------------------------------------------------------------------------------------------
function camelCase2(string) {
    return string.match(/\w+/gi).map((string,index) => {
        return index === 0 ? string : string = string[0].toUpperCase() + string.slice(1);
    }).join('');
}
//----------------------------------------------------------------------------------------------------------------------
// console.log(camelCase("-webkit-background-color"));
//console.log(camelCase2("-webkit-background-color"));
//console.log(camelCase2("background-color"));
//----------------------------------------------------------------------------------------------------------------------
//возвращает строку в camelCase для дата атрибутов, передать строку "data-name-attr"
function camelCaseDataKey(dataKey) {
    if (typeof dataKey !== "string" || !dataKey.startsWith("data-")) {
        return "";
    }
    let index = 0;
    return dataKey.replace(/\b\w+\b/g, match => {
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
//----------------------------------------------------------------------------------------------------------------------
//testing function
//console.log(camelCaseDataKey("data-filter-list"));
//----------------------------------------------------------------------------------------------------------------------
// сравнивает два слова или строки посимвольно.
// например  fir и first даст true, сравнение где важно порядок вводимых символов ( например при input).
function isCompareWords(first_word, second_word, register = true) {
    if (!isCompareWords.isString) {
        isCompareWords.isString = string => typeof string === "string";
    }
    let isString = isCompareWords.isString;
    if ((!first_word || !second_word) || !isString(first_word) || !isString(second_word)) {
        console.log(1);
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
//testing function
// console.log(isCompareWords("first","First" ));
// console.log(isCompareWords("second", "second"));
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// сравнивает два слова или строки посимвольно.
// например  fir и first даст true, сравнение где важно порядок вводимых символов ( например при input).
function isCompareWordsRec(first_word, second_word,register = true) {
    let first  = typeof first_word  === "string";
    let second = typeof second_word === "string";
    if ((!first_word || !second_word) || !first || !second) {
       return  false;
    }
    let index;
    if (!("index" in isCompareWordsRec)) {
        index = isCompareWordsRec.index = 0;
    } else {
        index = isCompareWordsRec.index ++;
    }
    if ( index === first_word.length) {
        delete isCompareWordsRec.index;
        return true;
    }
    if (!index  && !register) {
        first_word = first_word.toLowerCase();
        second_word = second_word.toLowerCase();
    }
    if (first_word[index].localeCompare(second_word[index])) {
        delete isCompareWordsRec.index;
        return false;
    }
    return isCompareWordsRec(first_word,second_word, register);
}
//testing
 //console.log(isCompareWordsRec("first", "first"));
//----------------------------------------------------------------------------------------------------------------------
// определяет равны ли между собой строки.
function isFullCompareWords(str, compareString, register = true) {
    let first  = typeof str === "string";
    let second = typeof compareString === "string";
    if (!str || !compareString || !first || !second) {
       return  false;
    }
    if (!register) {
        str = str.toLowerCase();
        compareString = compareString.toLowerCase();
    }
    return !str.localeCompare(compareString);
}
//testing
// console.log(isFullCompareWords("first", "First", false));
// console.log(isFullCompareWords(3,5));
//----------------------------------------------------------------------------------------------------------------------
//есть ли подстрока в слове
function isStringIncludesSubstr(string, substring, register = true) {
    let first  = typeof string === "string";
    let second = typeof substring === "string";
    if (!string || !substring || !first || !second) {
       return  false;
    }
    if (!register) {
        string = string.toLowerCase();
        substring = substring.toLowerCase();
    }
    return  string.includes(substring);
}
//testing function
// console.log(isStringIncludesSubstr("firs", "Fir", false));
// console.log(isStringIncludesSubstr("fi", 1));
//----------------------------------------------------------------------------------------------------------------------
function _bindContextAndArgs (func, context, ...bindArgs) {
    return function (...getArgs) {
        return func.call(context, ...bindArgs, ...getArgs);
    }
}
function _bindArgs(func, ...bindArgs) {
    return function (...getArgs) {
        return  func.apply(this, [...bindArgs, ...getArgs]);
    }
}
//----------------------------------------------------------------------------------------------------------------------
function _localStorage( key, value = null) {
    if (typeof key === "string") {
        if (value ) {
            localStorage.setItem(key, JSON.stringify(value));
            return;
        }
        return JSON.parse(localStorage.getItem(key));
    }
}
//----------------------------------------------------------------------------------------------------------------------
function isEmptyObject (obj) {
    return Object.keys(obj).length === 0;
}
//----------------------------------------------------------------------------------------------------------------------

function getSumArray(array, index = 0) {
    if (index === array.length) {
        return 0;
    }
    return  array[index] + getSumArray(array, index +1);
}

function getSumArrays(array, index = 0 ) {
    let sum = 0;
    if (index === array.length) {
        return sum;
    }
    if (Array.isArray(array[index])) {
        sum += getSumArrays(array[index]);
    } else {
        sum += array[index];
    }
    sum += getSumArrays(array, index + 1);
    return  sum;
}
//testing functions
// let arr = [1,2,3,4,5];
// let arr3 = [[1,2],[3,4],[5,6],7,8]
// let arr2 =[];
// console.log(getSumArray(arr));
// console.log(getSumArrays(arr3));
//----------------------------------------------------------------------------------------------------------------------


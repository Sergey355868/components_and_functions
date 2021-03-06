let array = [
    {
        undermenu: {
            Yandex:'https://yandex.ru/',
        },
        submenu: [
            {
                undermenu: {
                    sub:'path'
                },
                submenu:[
                    {
                        undermenu: {
                            sub2:'path'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path2'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path3'
                        },
                    },
                ]
            },
            {
                undermenu: {
                    sub:'path',
                },
                submenu:[
                    {
                        undermenu: {
                            sub2:'path'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path2'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path3'
                        },
                    },
                ]
            },
            {
                undermenu: {
                    sub:'path'
                },
                submenu:[
                    {
                        undermenu: {
                            sub2:'path'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path2'
                        },
                    },
                    {
                        undermenu: {
                            sub2:'path3'
                        },
                    },
                ]
            },
        ]
    },
    {
        undermenu: {
            key:'path'
        },
        submenu: [
            {
                undermenu: {
                    sub:'path'
                },
            },
            {
                undermenu: {
                    sub:'path'
                },
            },
            {
                undermenu: {
                    sub:'path'
                },
            },
        ]
    },
    {
        undermenu: {
            key:'path'
        },
        submenu: [
            {
                undermenu: {
                    sub:'path'
                },
            },
            {
                undermenu: {
                    sub:'path'
                },
            },
            {
                undermenu: {
                    sub:'path'
                },
            },
        ]
    },

];
let array2 = [
    {
        undermenu: {
            Yandex:'https://yandex.ru/',
        },

    },
    {
        undermenu: {
            key:'path'
        },

    },
    {
        undermenu: {
            key:'path'
        },

    },

];

class MenuOpen {
    forFirstDivs              = null;
    divUnderMenuForLeaveEnter = new Map();
    divUnderMenuForOverOut    = new Map();
    deleteHandlers            = [];
    constructor({
        arrayMenu  =  array,  // ????????????  ??????  ???????????????? ????????.// ???????????? ????????.
        HtmlObjectForPaste = document.getElementById('root'), // ?????????? ????????????.
        methodPaste   = 'append',   //'before,after,prepend' // ???????????? ??????????????
        mouseHandler = 'move', // 'enter_leave','move','over_out', 'none' - ???????????????? ???????? ?????????????????????? ???????????????????? ???? ?????????????????? // ?????????????????? ?????????????? ????????.
        classes= {
            root_allMenu:  ['menu_open'],       // ???????????? ?????? ?????????????????? ???????????????? ????????.
            firstUndermenu:['first_undermenu'], // ???????????? ???????????????????? ???????????? ??????????????
            firstLink:     ['first_link'],      // ???????????? ???????????????????? ???????????? ????????????
            firsTriangle:  ['first_triangle'],  // ???????????? ???????????????????? ???????????? ??????????????????????????
            firstSubmenu:  ['first_submenu'],   // ???????????? ???????????????????? ???????????? ??????????????.
            // - ?????????? ?????????????????? ???????????? ?????? ???????????? ???????? ???????? ??????????????????????--------------------
            undermenu:     ['undermenu'],        // ???????????? ???????????????????? ?????????????????? ??????????????.
            link:          ['link'],            //  ???????????? ???????????????????? ?????????????????? ????????????
            //------------------------------------------------------------------------------
            triangle:      ['triangle'],         // ???????????? ???????????????????? ?????????????????? ??????????????????????????
            submenu:       ['submenu'],         // ???????????? ???????????????????? ?????????????????? ??????????????
            notVisible:    ['not_visible'],     // ???????????? ?????? ??????????????  ??????????????.
            visible:       ['visible'],
            rotationFirst: ['rotation_first'] , // ???????????? ?????? ?????????????????? ????????????????????????  ?????? ???????????????? ???????? ?? ???????????? ??????????????
            rotation:      ['rotation'],        // ???????????? ?????? ?????????????????? ????????????????????????  ?????? ???????????????? ???????? ?? ?????????????????????? ??????????????
        },
    } = {}) {
        this.arrayMenu = arrayMenu;
        this.HtmlObjectForPaste = HtmlObjectForPaste;
        this.methodPaste = methodPaste;
        this.mouseHandler = mouseHandler;
        this.classes = classes;
        this.findErrorsArrayMenu(this.arrayMenu);
        this.forFirstDivs = new Set(this.arrayMenu);
        this.createAndPasteMenu(this.HtmlObjectForPaste, this.methodPaste);
        this.selectHandlers(this.mouseHandler, this.classes);
        //console.log(this.divUnderMenuForLeaveEnter);
        //console.log(this.divUnderMenuForOverOut);
    }
    selectHandlers(mouseHandler, classes) {
        if (mouseHandler === 'enter_leave') {
            this.addHandlerEnterAndLeave(this.divUnderMenuForLeaveEnter, classes);
        }
        if (mouseHandler === 'move') {
            document.addEventListener('mousemove',
            this.debounce(this.handlerMoove(this.divUnderMenuForOverOut, classes),30));
        }
        if (mouseHandler  === 'over_out') {
            document.addEventListener('mouseover',
            this.handlerOverOut(this.divUnderMenuForOverOut, classes));
        }
        if (mouseHandler !== 'enter_leave' && mouseHandler !== 'move'
            && mouseHandler !== 'over_out' && mouseHandler !== 'none') {
            throw new Error('?????? ?????????????????? ?????????????????????? ???????? "mouseHandler" ' +
            '???????????? ?????????? ???????????????? "enter_leave","move","over_out", ??????  "none" ???????? ???????? ??????????????????????');
        }
    }
    remooveHandlers(arrayDeleteHandlers) {
        arrayDeleteHandlers.forEach( obj => {
            Object.entries(obj).forEach(([mouseHandler, funcHandler]) => {
                document.removeEventListener(mouseHandler, funcHandler);
            });
        });
    }
    handlerOverOut(divUnderMenuForOverOut, classes) {
        let map     = new Map();
        let submenu = null, triangle = null ,entry = null ,entryChildren = null, submenuTarget = null;
        let first   = false;
        let handler = ({ target, relatedTarget }) => {
            console.log('mouseover');
            // ?????????????? ????-???? ???????????????? ????????  ?????? ?? ?????????????? ??????????????.
            if ((!divUnderMenuForOverOut.has(relatedTarget) &&
                divUnderMenuForOverOut.has(target) )
                && !entry) {
                entry   = target;
                ({submenu, triangle, first, children:entryChildren }
                = divUnderMenuForOverOut.get(entry));
                this.toggleClasses(submenu, classes.notVisible); // ??????????????.
                this.toggleTriangle(first, triangle, classes);
            }
            // ?????????????? ???????????? ????????
            if (entry) {
                if (entryChildren.has(relatedTarget)
                    && entryChildren.has(target)
                    && divUnderMenuForOverOut.has(target)
                    && submenuTarget !== target
                    && target !== entry ) {
                    submenuTarget = target;
                    let { submenu: submenuin, triangle, first } = divUnderMenuForOverOut.get(submenuTarget);
                    // ???????????? ??????????, ???????? submenuTarget === null;
                    if (submenuin !== submenu) {
                        this.toggleClasses(submenuin, classes.notVisible);
                        this.toggleTriangle(first, triangle, classes);
                        map.set(submenuTarget, divUnderMenuForOverOut.get(submenuTarget));
                        // ???????????????? ?????????????????????? ??????????????.
                        this.clearUnderMenu(map,submenuTarget,classes);
                    }
                }
                // ?????????????? ???? ???????????? ????????.
                if (map.size && target === entry) {
                    submenuTarget = null;
                    // ???????????????? ?????????????????????? ??????????????.
                    this.clearUnderMenu(map, target, classes);
                }
                //???????????????? ????????.
                if (!entryChildren.has(target) && entryChildren.has(relatedTarget)) {
                    this.toggleClasses(submenu, classes.notVisible); // ??????????????????
                    this.toggleTriangle(first, triangle, classes);
                    submenu = entry = triangle = submenuTarget = entryChildren = null;
                    first = false;
                    // ???????? ????????  ?????????? ?????????????? ??????????????.
                    // ???????????? ???????????????????? map
                    if (map.size) {
                        this.clearInMap(map, classes);
                    }
                    //???????? ???????????? ???? ???????????? ????????.
                    if (divUnderMenuForOverOut.has(target) && !entry) {
                        entry   = target;
                        ({submenu, triangle, first, children:entryChildren }
                            = divUnderMenuForOverOut.get(entry));
                        this.toggleClasses(submenu, classes.notVisible); // ??????????????.
                        this.toggleTriangle(first, triangle, classes);
                    }
                }
            }
        };
        this.deleteHandlers.push({
            mouseover:handler
        });
        return handler;
    }
    debounce(func, ms) {
        let isCooldown = false;
        let handler = (...arg) => {
            if (isCooldown) return;
            func.apply(this, arg);
            isCooldown = true;
            setTimeout(() => isCooldown = false, ms);
        };
        this.deleteHandlers.push({
            mousemove:handler,
        });
        return handler;
    }
    handlerMoove(divUnderMenuForOverOut, classes) {
        let map     = new Map();
        let submenu = null, triangle = null ,entry = null ,entryChildren = null, submenuTarget = null;
        let first   = false;
        return (event) => {
            let { target } = event;

            // ???????????? ????????
            if (divUnderMenuForOverOut.has(target) && !entry) {
                entry = target;
                ({submenu, triangle, first, children:entryChildren }
                    = divUnderMenuForOverOut.get(entry));
                this.toggleClasses(submenu,  classes.notVisible); // ??????????????.
                this.toggleTriangle(first, triangle, classes);
            }
            //?????????????? ????????????  menu
            if (entry) {
                // ?????????????? ???? ??????????????.
                if (entryChildren.has(target)
                    && divUnderMenuForOverOut.has(target)
                    && submenuTarget !== target
                    && target !== entry) {
                    submenuTarget = target;
                    let { submenu: submenuin, triangle, first } = divUnderMenuForOverOut.get(submenuTarget);
                    // ???????????? ??????????, ???????? submenuTarget === null;
                    if (submenuin !== submenu ) {
                        this.toggleClasses(submenuin, classes.notVisible);
                        this.toggleTriangle(first, triangle, classes );
                        map.set(submenuTarget, divUnderMenuForOverOut.get(submenuTarget));
                        // ???????????????? ?????????????????????? ??????????????.
                        this.clearUnderMenu(map,submenuTarget,classes);
                    }
                }
                // ?????????????? ???? ???????????? ????????.
                if (map.size && target === entry) {
                    submenuTarget = null;
                    // ???????????????? ?????????????????????? ??????????????.
                    this.clearUnderMenu(map, target, classes);
                }
                // ???????????????? menu.
                if (!entryChildren.has(target)) {
                    this.toggleClasses(submenu, classes.notVisible); // ??????????????????
                    this.toggleTriangle(first, triangle, classes);
                    submenu = entry = triangle = submenuTarget = entryChildren = null;
                    first = false;
                    // ???????? ????????  ?????????? ?????????????? ??????????????.
                    // ???????????? ???????????????????? map
                    if (map.size) {
                        this.clearInMap(map, classes);
                    }
                }
            }
        };
    }
    toggleTriangle(first, triangle, classes) {
        first ? this.toggleClasses(triangle, classes.rotationFirst)
        : this.toggleClasses(triangle, classes.rotation);
    }
    clearInMap(map, classes) {
        map.forEach((value, key, map) => {
            let { triangle, first, submenu } = value;
            this.addClasses(submenu, classes.notVisible);
            first ? this.removeClasses(triangle, classes.rotationFirst)
                : this.removeClasses(triangle, classes.rotation);
            map.delete(key);
        });
    }
    clearUnderMenu(map, target, classes) {
        map.forEach((value, key, map) => {
            let { children, triangle, first, submenu} = value;
            if (!children.has(target)) {
                this.addClasses(submenu, classes.notVisible);
                first ? this.removeClasses(triangle, classes.rotationFirst)
                    : this.removeClasses(triangle, classes.rotation);
                map.delete(key);
            }
        });
    }
    addHandlerEnterAndLeave(divUnderMenuForLeaveEnter, classes) {
        divUnderMenuForLeaveEnter.forEach((value, key) => {
            this.handlerEnterLeave(key, value, classes);
        });
    }
    handlerEnterLeave(undermenu, obj, classes) {
        undermenu.onmouseenter = () => {
            let { submenu, triangle, first }  = obj;
            this.toggleClasses(submenu, classes.notVisible );
            first ? this.toggleClasses(triangle, classes.rotationFirst)
                : this.toggleClasses(triangle, classes.rotation);
            undermenu.onmouseleave = () => {
                this.toggleClasses(submenu, classes.notVisible);
                first ? this.toggleClasses(triangle, classes.rotationFirst)
                    : this.toggleClasses(triangle, classes.rotation);
                undermenu.onmouseleave = null;
            };
        };
    }
    createAndPasteMenu(HtmlObjectForPaste, methodPaste) {
        if (HtmlObjectForPaste && Element.prototype[methodPaste]) {
            HtmlObjectForPaste[methodPaste](this.createMenu(this.arrayMenu));
        } else {
            throw  new Error('???????????? ?????? ?????????????? ???? ???????????? ?????? ???????????? ?????????????? ???? ????????????????????');
        }
    }
    createMenu(arrayMenu) {
        let root_allMenu = document.createElement('div');
        this.addClasses(root_allMenu, this.classes.root_allMenu);
        let needThis = this;
        (function InCreateMenu (root, arrayMenu) {
            for( let obj of arrayMenu) {
                let{ undermenu, submenu } = obj;
                //console.log(undermenu,submenu);
                let root_underMenu = document.createElement('div');
                needThis.addClasses(root_underMenu, needThis.classes.undermenu);
                root.append(root_underMenu);
                //----
                let a = document.createElement('a');
                needThis.addClasses(a, needThis.classes.link);
                Object.entries(undermenu).forEach(([name, path]) => {
                    a.append(name);
                    a.href = path;
                });
                root_underMenu.append(a);
                //---------------------
                if (submenu) {
                    let triangle = document.createElement('div');
                    needThis.addClasses(triangle, needThis.classes.triangle);
                    root_underMenu.append(triangle);
                    //------------------------------------------------------------------------
                    let submenuDiv = document.createElement('div');
                    needThis.addClasses(submenuDiv, [...needThis.classes.submenu, ...needThis.classes.notVisible]);
                    root_underMenu.append(submenuDiv);
                    //------------------------------------------------------------------------
                    // ?????????????????? ?????????????? ?????? ?????????????? ???????? mouseenter ?? mouseleave .
                    needThis.divUnderMenuForLeaveEnter.set(root_underMenu, {
                        submenu:submenuDiv,
                        triangle,
                        first:false,
                    });
                    //------------------------------------------------------------------------
                    //??????????????????  ?????????????? ?????????????? ???????? ?????? mouseover ?? mouseout, mousemoove.
                    needThis.divUnderMenuForOverOut.set(root_underMenu, {
                        submenu:submenuDiv,
                        children:null,
                        triangle,
                        first:false,
                        countChildren:root_underMenu,
                    })
                        .set(a, {
                            submenu:submenuDiv,
                            children:null,
                            triangle,
                            first:false,
                            countChildren:root_underMenu,
                        })
                        .set(triangle,{
                            submenu:submenuDiv,
                            children:null,
                            triangle,
                            first:false,
                            countChildren:root_underMenu,
                        });
                    //------------------------------------------------------------------------
                    if (needThis.forFirstDivs.has(obj)) {
                        // ?????????????????? ??????-???? ???????????????? ???????????? ????????????????????????.
                        //----------------------------------------------------------
                        [root_underMenu, a, triangle].forEach((obj) => {
                            if (needThis.divUnderMenuForLeaveEnter.has(obj)) {
                                needThis.divUnderMenuForLeaveEnter.get(obj).first = true;
                            }
                            needThis.divUnderMenuForOverOut.get(obj).first = true;
                        });
                        //--------------------------------------------------
                        // ?????????????????? ???????????? ?????? ???????????? ??????????????????.
                        [
                            [root_underMenu, needThis.classes.firstUndermenu],
                            [submenuDiv, needThis.classes.firstSubmenu],
                            [a, needThis.classes.firstLink],
                            [triangle, needThis.classes.firsTriangle]
                        ].forEach(([object,classes]) => {
                            needThis.addClasses(object, classes);
                        });
                    }
                    InCreateMenu(submenuDiv,submenu);
                }
            }
        })(root_allMenu, arrayMenu);
        this.forFirstDivs = null;
        this.setMapChildren(this.divUnderMenuForOverOut);
        return root_allMenu;
    }
    deleteMenu(arrayDeleteHandlers) {
        this.remooveHandlers(arrayDeleteHandlers);
    }
    setMapChildren(divUnderMenuForOverOut) {
        divUnderMenuForOverOut.forEach((value) => {
            value.children = new Set(this.findChildren(value.countChildren));
        });
    }
    findChildren(root) {
        let arrayChildren = [];
        arrayChildren.push(root);
        if (root.children.length) {
            for(let child of root.children) {
                arrayChildren.push(...this.findChildren(child));
            }
        }
        return arrayChildren;
    }
    removeClasses(htmlObj, arrayClasses) {
        for (let classObj of arrayClasses) {
            if (htmlObj.classList.contains(classObj)) {
                htmlObj.classList.remove(classObj);
            }
        }
    }
    addClasses(htmlObj, arrayClasses) {
        for (let classObj of arrayClasses) {
            if (htmlObj.classList.contains(classObj)) {
                continue;
            }
            htmlObj.classList.add(classObj);
        }
    }
    toggleClasses(htmlObj, arrayClasses) {
        for (let classObj of arrayClasses) {
            htmlObj.classList.toggle(classObj);
        }
    }
    findErrorsArrayMenu(arrayMenu) {
        if (Array.isArray(arrayMenu) && arrayMenu.length) {
            for (let object of arrayMenu) {
                if (Object.keys(object).length === 0 ||
                    Object.keys(object).length > 2) {
                    throw  new Error('???????????? ???? ???????????? ???????? ???????????? ?? ???????????????????? ?????????? ???????????? ???????? ???????????????? ????????: "udermenu" ?????? "submenu"');
                }
                if (!this.isRightNames(object)) {
                    throw new Error('?????????? ?????????????? ???????????? ???????????????????? ???????? "undermenu" ???????? "submenu"');
                }
                if  (!object.undermenu
                    || typeof object.undermenu !== 'object'
                    || Array.isArray(object.undermenu)){
                    throw  new Error('?????????????????? ?????????????? ???????????? ???????? ???????????? ?? ???????????????????????? ?????????? "{ undermenu:{name: path}}",' +
                        '?????? ???? ?????????? ???????? ???????? "submenu:[]",?????????????? ???????????? ???????? ???????????????? ????????????????.');
                }
                if (this.isEmptyObject(object.undermenu)) {
                    throw  new Error('???????????? "undermenu:{ name:path }" ???? ???????????? ???????? ????????????!!!');
                }

                if (object.submenu) {
                    this.findErrorsArrayMenu(object.submenu);
                }
            }
        } else {
            throw  new Error('?????????????? ?????????????? ???????????? ???????????????? ?? ???????? "arrayMenu",' +
                '???????? submenu ???????????? ????????  ???????????????? ????????????????,' +
                '???????????? ???? ???????????? ???????? ????????????.');
        }
    }
    isRightNames(obj) {
        let answer ;
        for (let key of Object.keys(obj)) {
            answer = (key === 'undermenu' || key === 'submenu');
            if (!answer) {
                return answer;
            }
        }
        return answer;
    }
    isEmptyObject(obj) {
        return Object.entries(obj).reduce((accum,[_, path], __, array) => {
            if (array.length > 1) {
                throw  new Error('???????????? "undermenu:{name:path}",???????????? ?????????? ???????????? ???????? ????????');
            }
            if (typeof path !== 'string') {
                throw  new Error('???????????????? ?????? path ??  ?????????????? "undermenu:{name:path}" ???????????? ???????? ??????????????');
            }
            return ++accum;
        },0) === 0;
    }
}
let menuopen = new MenuOpen();

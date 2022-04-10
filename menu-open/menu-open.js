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
        arrayMenu  =  array,  // массив  для  создания меню.// пример выше.
        HtmlObjectForPaste = document.getElementById('root'), // место втавки.
        methodPaste   = 'append',   //'before,after,prepend' // способ вставки
        mouseHandler = 'move', // 'enter_leave','move','over_out', 'none' - означает меню невложенное обработчик не требуется // установка события мыши.
        classes= {
            root_allMenu:  ['menu_open'],       // классы для корневого элемента меню.
            firstUndermenu:['first_undermenu'], // классы оформления первых подменю
            firstLink:     ['first_link'],      // классы оформления первых ссылок
            firsTriangle:  ['first_triangle'],  // классы оформления первых треугольников
            firstSubmenu:  ['first_submenu'],   // классы оформления первых подменю.
            // - будут применены только эти классы если меню невложенное--------------------
            undermenu:     ['undermenu'],        // классы оформления остальных подменю.
            link:          ['link'],            //  классы оформления остальных ссылок
            //------------------------------------------------------------------------------
            triangle:      ['triangle'],         // классы оформления остальных треугольников
            submenu:       ['submenu'],         // классы оформления остальных подменю
            notVisible:    ['not_visible'],     // классы для скрытия  подменю.
            visible:       ['visible'],
            rotationFirst: ['rotation_first'] , // классы для поведения треугольника  при событиях мыши у первых подменю
            rotation:      ['rotation'],        // классы для поведения треугольника  при событиях мыши у последующих подменю
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
            throw new Error('Для установки обработчика поле "mouseHandler" ' +
            'должно иметь значение "enter_leave","move","over_out", или  "none" если меню невложенное');
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
            // переход из-за пределов окна  или с другого элмента.
            if ((!divUnderMenuForOverOut.has(relatedTarget) &&
                divUnderMenuForOverOut.has(target) )
                && !entry) {
                entry   = target;
                ({submenu, triangle, first, children:entryChildren }
                = divUnderMenuForOverOut.get(entry));
                this.toggleClasses(submenu, classes.notVisible); // убираем.
                this.toggleTriangle(first, triangle, classes);
            }
            // переход внутри меню
            if (entry) {
                if (entryChildren.has(relatedTarget)
                    && entryChildren.has(target)
                    && divUnderMenuForOverOut.has(target)
                    && submenuTarget !== target
                    && target !== entry ) {
                    submenuTarget = target;
                    let { submenu: submenuin, triangle, first } = divUnderMenuForOverOut.get(submenuTarget);
                    // первый заход, пока submenuTarget === null;
                    if (submenuin !== submenu) {
                        this.toggleClasses(submenuin, classes.notVisible);
                        this.toggleTriangle(first, triangle, classes);
                        map.set(submenuTarget, divUnderMenuForOverOut.get(submenuTarget));
                        // Зачистка предыдущего подменю.
                        this.clearUnderMenu(map,submenuTarget,classes);
                    }
                }
                // выходим на первое меню.
                if (map.size && target === entry) {
                    submenuTarget = null;
                    // Зачистка предыдущего подменю.
                    this.clearUnderMenu(map, target, classes);
                }
                //покидаем меню.
                if (!entryChildren.has(target) && entryChildren.has(relatedTarget)) {
                    this.toggleClasses(submenu, classes.notVisible); // добавляем
                    this.toggleTriangle(first, triangle, classes);
                    submenu = entry = triangle = submenuTarget = entryChildren = null;
                    first = false;
                    // если ушли  когда подменю открыто.
                    // чистим внутренний map
                    if (map.size) {
                        this.clearInMap(map, classes);
                    }
                    //если попали на другое меню.
                    if (divUnderMenuForOverOut.has(target) && !entry) {
                        entry   = target;
                        ({submenu, triangle, first, children:entryChildren }
                            = divUnderMenuForOverOut.get(entry));
                        this.toggleClasses(submenu, classes.notVisible); // убираем.
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

            // первый вход
            if (divUnderMenuForOverOut.has(target) && !entry) {
                entry = target;
                ({submenu, triangle, first, children:entryChildren }
                    = divUnderMenuForOverOut.get(entry));
                this.toggleClasses(submenu,  classes.notVisible); // убираем.
                this.toggleTriangle(first, triangle, classes);
            }
            //переход внутри  menu
            if (entry) {
                // перешли на подменю.
                if (entryChildren.has(target)
                    && divUnderMenuForOverOut.has(target)
                    && submenuTarget !== target
                    && target !== entry) {
                    submenuTarget = target;
                    let { submenu: submenuin, triangle, first } = divUnderMenuForOverOut.get(submenuTarget);
                    // первый заход, пока submenuTarget === null;
                    if (submenuin !== submenu ) {
                        this.toggleClasses(submenuin, classes.notVisible);
                        this.toggleTriangle(first, triangle, classes );
                        map.set(submenuTarget, divUnderMenuForOverOut.get(submenuTarget));
                        // Зачистка предыдущего подменю.
                        this.clearUnderMenu(map,submenuTarget,classes);
                    }
                }
                // выходим на первое меню.
                if (map.size && target === entry) {
                    submenuTarget = null;
                    // Зачистка предыдущего подменю.
                    this.clearUnderMenu(map, target, classes);
                }
                // покидаем menu.
                if (!entryChildren.has(target)) {
                    this.toggleClasses(submenu, classes.notVisible); // добавляем
                    this.toggleTriangle(first, triangle, classes);
                    submenu = entry = triangle = submenuTarget = entryChildren = null;
                    first = false;
                    // если ушли  когда подменю открыто.
                    // чистим внутренний map
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
            throw  new Error('Объект для вставки не найден или метода вставки не существует');
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
                    // добавляем объекты для событий мыши mouseenter и mouseleave .
                    needThis.divUnderMenuForLeaveEnter.set(root_underMenu, {
                        submenu:submenuDiv,
                        triangle,
                        first:false,
                    });
                    //------------------------------------------------------------------------
                    //добавляем  объекты события мыши для mouseover и mouseout, mousemoove.
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
                        // добавляем что-бы отметить первые треугольники.
                        //----------------------------------------------------------
                        [root_underMenu, a, triangle].forEach((obj) => {
                            if (needThis.divUnderMenuForLeaveEnter.has(obj)) {
                                needThis.divUnderMenuForLeaveEnter.get(obj).first = true;
                            }
                            needThis.divUnderMenuForOverOut.get(obj).first = true;
                        });
                        //--------------------------------------------------
                        // добавляем классы для первых элементов.
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
                    throw  new Error('Объект не должен быть пустым и количество полей должно быть небольше двух: "udermenu" или "submenu"');
                }
                if (!this.isRightNames(object)) {
                    throw new Error('Ключи объекта должны называться либо "undermenu" либо "submenu"');
                }
                if  (!object.undermenu
                    || typeof object.undermenu !== 'object'
                    || Array.isArray(object.undermenu)){
                    throw  new Error('Элементом массива должен быть объект с обязательным полем "{ undermenu:{name: path}}",' +
                        'так же может быть поле "submenu:[]",которое должно быть массивом объектов.');
                }
                if (this.isEmptyObject(object.undermenu)) {
                    throw  new Error('Объект "undermenu:{ name:path }" не должен быть пустым!!!');
                }

                if (object.submenu) {
                    this.findErrorsArrayMenu(object.submenu);
                }
            }
        } else {
            throw  new Error('функция ожидает массив объектов в поле "arrayMenu",' +
                'поле submenu должно быть  массивом объектов,' +
                'массив не должен быть пустым.');
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
                throw  new Error('Объект "undermenu:{name:path}",должен иметь только одно поле');
            }
            if (typeof path !== 'string') {
                throw  new Error('Значение для path в  объекте "undermenu:{name:path}" должно быть строкой');
            }
            return ++accum;
        },0) === 0;
    }
}
let menuopen = new MenuOpen();

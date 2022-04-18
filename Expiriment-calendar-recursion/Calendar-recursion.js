class CalendarRecursion {
    _id_month = "month";
    _id_body = "body";
    animation_next =["numbers_animate_next"];
    animation_prev =["numbers_animate_prev"];
    no_current_month_days  =["calendar__numbers_nocurrent"];
    _current_day = ["calendar__nubers_current-day"];
    classes = {
        calendar: ["calendar"],
        calendar__head:["calendar__head"],
        calendar__body:["calendar__body"],
        calendar__days:["calendar__days"],
        calendar__numbers:["calendar__numbers"],
        days__contaner:["calendar__days-contaner"],
        numbers__contaner:["calendar__number-contaner"],
        calendar__month:["calendar__month"],
        calendar__prev:["calendar__arrow-prev"],
        calendar__next:["calendar__arrow-next"],
    };
    monthes = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    month1 = "";
    current_day = 0;
    current_month;
    copyDate = null;
    firts_call = true;
    current_number = false;
    calendarDays = this.createCalendarDays();
    structur = {
        type:"div",
        props: {
            className: this._join2(this.classes.calendar, " "),
        },
        children: [
            {
                type:"div",
                props: {
                    className:this._join2(this.classes.calendar__head, " "),
                },
                children: [
                    {
                        type: "div",
                        props:{
                            className:this._join2(this.classes.calendar__prev),
                            innerHTML: "&#9668;",
                            onclick: this.clickHandlerPrev.bind(this),
                        }
                    },
                    {
                        type: "div",
                        props: {
                            className: this._join2(this.classes.calendar__month),
                            textContent: this.month1,
                            id:this._id_month,
                        }
                    },
                    {
                        type: "div",
                        props: {
                            className: this._join2(this.classes.calendar__next),
                            innerHTML: "&#9658;",
                            onclick: this.clickHandlerNext.bind(this),
                        }
                    },
                ]
            },
            {
                type: "div",
                props: {
                    className: this._join2(this.classes.calendar__body, " "),
                    id: this._id_body,
                },
                children : [
                    {
                        type:"div",
                        props: {
                            className: this._join2(this.classes.days__contaner, " ")
                        },
                        children: [
                            this.createDays(this.calendarDays[0], this.classes.calendar__days),
                        ],
                    },
                    {
                        type: "div",
                        props: {
                            className: this._join2(this.classes.numbers__contaner," "),

                        },
                        children: [
                            this.createNumbers(this.calendarDays[1], this.classes.calendar__numbers),
                        ],
                    },
                ]
            }
        ]
    }
    month = null;
    body = null;
    constructor({
        wherePaste = document.body,
        methodPaste = "append",
    } = {}) {
        this.wherePaste = wherePaste;
        this.methodPaste = methodPaste;
        this.calendar = this.createCalendarFromStructur(this.structur);
        if (this.wherePaste instanceof Element && Element.prototype[this.methodPaste]) {
            this.wherePaste[this.methodPaste](this.calendar);
        }
        this.month = document.getElementById(this._id_month);
        this.body = document.getElementById(this._id_body);
    }
    createCalendarDays({
           calendar =[ ["Пн","Вт","Ср","Чт","Пт","Cб","Вс"],[]],
           weeks =[],
           count = 0,
           date = new Date(),
           allDays = 42
    } = {}) {
        if (!count) {
            if (this.firts_call) {
                this.current_day = date.getDate();
                this.current_month = date.getMonth();
                this.firts_call = false;
            }
            this.month1 = this._getMonth(date.getMonth()) + "  "  + date.getFullYear();
            this.copyDate = this.copyDate || new Date(date);
            function getDays(date) {
                let day = date.getDay();
                return day ? day : 7
            }
            date.setDate(1);
            let dayWeek = getDays(date);
            date.setDate(dayWeek !==1 ? (date.getDate() - (dayWeek - 1)) : (date.getDate() - 7));
        }
        if (count % 7 === 0 && count) {
            calendar[1].push(weeks);
            weeks = [];
        }
        if (count === allDays) {
            return  calendar;
        }
        weeks.push(date.getDate());
        date.setDate(date.getDate() +1 );
        return this.createCalendarDays({ calendar, weeks, count: count + 1, date, allDays });
    }
    _getMonth(number) {
        return this.monthes[number];
    }
    clickHandlerPrev () {
        this.getCalendar(this.copyDate, this.classes,this.body,false);
    }
    clickHandlerNext() {
        this.getCalendar(this.copyDate, this.classes, this.body);
    }
    getCalendar(cloneDate, classes, contaner, next = true) {
        if (next) {
            cloneDate.setMonth(cloneDate.getMonth() +1);
        } else {
            cloneDate.setMonth(cloneDate.getMonth() - 1);
        }
        let calendarDays = this.createCalendarDays({
            date: new Date(cloneDate),
        });
        let container_days =  document.createElement("div");
        if (next) {
            container_days.className = this._join2(this.classes.numbers__contaner.concat(this.animation_next), " ");
        } else {
            container_days.className = this._join2(this.classes.numbers__contaner.concat(this.animation_prev), " ");
        }
        contaner.lastElementChild.remove();
        let days = this.createNumbers(calendarDays[1], classes.calendar__numbers);
        container_days.append(...days);
        this.month.textContent = this.month1;
        contaner.append(container_days);
    }
    _join(array, separator = "", string = "", index = 0) {
        if (array.length === index) {
            return string;
        }
        string +=  separator + array[index];
        return  this._join(array,separator, string, index + 1);
    }
    _join2(array, separator = "", index = 0) {
        if (array.length === index) {
            return "";
        }
        return (!index ? array[index] : separator + array[index]) + this._join2 (array, separator, index + 1);
    }
    createDays(array, classes, index = 0) {
        if (index === array.length) {
            return  [];
        }
        let items = document.createElement('div');
        items.append(array[index]);
        items.className = this._join2(classes," ");
        return [items, ...this.createDays(array, classes, index +1)];
    }
    createNumbers(array, classes, index = 0) {
        let _array = [];
        if (index === array.length) {
            return _array;
        }
        if (Array.isArray(array[index])) {
            _array.push(...this.createNumbers(array[index],classes));
        } else {
            let _items = document.createElement("div");

            if (array[index] === 1) {
                this.current_number = !this.current_number;
            }
            if (this.current_number) {
                _items.className = this._join2(classes," ");
            } else {
                _items.className = this._join2(classes.concat(this.no_current_month_days)," ");
            }
            if (array[index] === this.current_day && this.current_month === this.copyDate.getMonth()) {
                _items.className += this._join(this._current_day, " ");
            }
            _items.append(array[index]);
            _array.push(_items);
        }
        return  _array.concat(this.createNumbers(array,classes,index + 1));
    }
    my_typeof(data) {
        return Object.prototype.toString.call(data).match(/\w+/gi)[1].toLowerCase();
    }
    recordAtrHtml(array_atrr, element) {
        if (array_atrr.length) {
            let [key, value] = array_atrr.pop();
            if (element) {
                element[key] = value;
            }
            this.recordAtrHtml(array_atrr, element);
        }
    }
    createCalendarFromStructur(structur) {
        let element = null;
        let _this = this;
        if (this.my_typeof(structur) === "object") {
            let keys = Object.keys(structur);
            (function get_keys(keys) {
                if (keys.length) {
                    let [key, value] = keys.shift();
                    if (_this.my_typeof(value) === "string" && key ==="type") {
                        element = document.createElement(value);
                    }
                    if (_this.my_typeof(value) ==="object" && key === "props") {
                        _this.recordAtrHtml(Object.entries(value), element);
                    }
                    if (_this.my_typeof(value) === "array" && key === "children") {
                        (function in_children(array) {
                            if (array.length) {
                                let child = array.shift();
                                if (_this.my_typeof(child) === "array") {
                                    element.append(...child);
                                }
                                if (_this.my_typeof(child) === "object") {
                                    element.append(_this.createCalendarFromStructur(child));
                                }
                                in_children(array);
                            }
                        })(value);
                    }
                    get_keys(keys);
                }
            })(Object.entries(structur))
        }
        return element;
    }
}
let calendar = new CalendarRecursion();
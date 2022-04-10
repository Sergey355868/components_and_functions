class CustomForm {
    obj_for = {
        checkboxes: null,
        radioblock: null,
        hidden    : null,
        select    : null,
        fileload  : null,
        reset     : null,
        submit    : null,
        input     : null,
    };
    select = null;
    constructor({
                    for_checkbox = [
                        "jQuery",
                        "HTML",
                        "CSS",
                        "PHP",
                        "MySql",
                    ],
                    for_radio = [
                        "Красивый(ая)",
                        "Умный(ая)",
                        "Коммуникабульный(ая)",
                        "Скромный(ая)",
                    ],
                    for_select = [
                        "Красивый(ая)",
                        "Умный(ая)",
                        "Коммуникабульный(ая)",
                        "Скромный(ая)",

                    ],
                    wherePaste = document.body,
                    methodPaste = 'append',
                } ={}) {
        this.for_checkbox = for_checkbox;
        this.for_radio   =  for_radio;
        this.for_select  =  for_select;
        this.wherePaste  =  wherePaste;
        this.methodPaste =  methodPaste;
        this.formToHtml(this.wherePaste, this.methodPaste);
    }
    findElementsOfForm(root, obj_for) {
        Object.keys(obj_for)
            .filter (dataKey => !obj_for[dataKey])
            .forEach(dataKey => {
                if (root.dataset[dataKey] !== undefined) {
                    obj_for[dataKey] = root;
                }
            });
        if (root.children.length) {
            for(let child of root.children) {
                this.findElementsOfForm(child, obj_for);
            }
        }
    }
    formToHtml(wherePaste, methodPaste) {
        let form = document.createElement('form');
        form.className = "customForm";
        form.name = "my_form";
        form.innerHTML = `
                 <h5>Ввод:</h5>
                 <div class="input">
                    <input type="text" id="text" name="text" data-input />
                 </div>
                 <h5>Текстовое поле:</h5>
                 <div>
                    <textarea class="textarea" data-textarea></textarea>
                 </div>
                 <h5>Выберите Ваше лучшее качество:</h5>
                 <div class="select" data-select>
                    <div  class="slct"> Качества ниже:</div>
                     ${ Array.isArray(this.for_select) ?this.createSelectUl(this.for_select) :'<strong>необходим массив</strong> ' }
                    <input type="hidden" id="select" name="select" />
                 </div>
                 <h5>Выберите Ваше лучшее качество:</h5>
                <div class="radioblock" data-radioblock>
                     ${ Array.isArray(this.for_radio) ?this.createRadio(this.for_radio) : '<strong>необходим массив</strong> ' }
                     <input data-hidden type="hidden" id="radio" name="radio" />
                </div>
                 <h5> Выберите, с какими языками программирования Вам доводилось сталкиваться :</h5>
                 <div class="checkboxes" data-checkboxes>
                    ${ Array.isArray(this.for_checkbox) ?this.createCheckbox(this.for_checkbox):'<strong>необходим массив</strong> ' }
                 </div>
                <div class="fileload" data-fileload>
                    <h5>Загрузка файла:</h5>
                    <div class="file-load-block">
                        <input type="file" value="" id="file" />
                        <div class="fileLoad">
                            <input type="text" value="Select file" />
                            <button data-button>Select file</button>
                        </div>
                    </div>
                </div>
                <div class="reset-form">
                    <h5>Сбрасываем поля формы</h5>
                    <button data-reset class="reset">Сброс</button>
                </div>

                <div class="sendmail">
                    <h5>Отправляем форму:</h5>
                    <button  data-submit type="submit">Отправить</button>
                </div>
            `;
        this.findElementsOfForm(form, this.obj_for);
        console.log(this.obj_for);
        this.forCheckBox(this.obj_for.checkboxes);
        this.forRadioBox(this.obj_for.radioblock);
        this.forSelect  (this.obj_for.select);
        this.forFileLoad(this.obj_for.fileload);
        this.obj_for.input.onkeypress = event => {
            if (event.key === 'Enter')  {
                event.preventDefault();
            }
        };
        this.obj_for.reset.onclick = event => {
            event.preventDefault();
            this.forReset(form);
        };

        this.obj_for.submit.onclick = event => {
            event.preventDefault();
            // обрабатываем  сами отсылку формы......
        }
        if (wherePaste && Element.prototype[methodPaste] && wherePaste instanceof Element) {
            wherePaste[methodPaste](form);
        } else {
            throw new Error('Объект для вставки не обнаружен или метода не существует');
        }
    }
    createSelectUl(arrayLi) {
        return`
                <ul class="drop visible">
                  ${ arrayLi.map(( string ) => {
            return `<li> ${ string } </li>`;
        }).join('') }
                </ul>
       `;
    }
    createRadio(arrayValues) {
        return arrayValues.map(value => {
            return `
                    <div class="radio">${value}</div>
                `;
        }).join('');
    }
    createCheckbox(arrayValues) {
        return arrayValues.map(value => {
            return `<div class="check">
                        ${ value }
                        <input type="checkbox" value=${value} name="checkboxes"/>
                      </div>
                `;
        }).join('');
    }
    forRadioBox(root) {
        let elem = null;
        let input =  this.obj_for.hidden;
        root.onclick = function ({target}) {
            let value = target.textContent;
            if (this.children.length) {

                input.value = value;
                if (elem) {
                    elem.classList.remove('active');
                }
                elem = target;
                elem.classList.add('active');
            }
        };
        root.onmousedown = () => false;
    }
    forCheckBox(root) {
        let map = new Map();
        function findInput(root) {
            if (root.children.length) {
                for (let child of root.children) {
                    if (child.type === 'checkbox') {
                        map.set(root, child);
                    }
                    findInput(child);
                }
            }
        }
        findInput(root);
        root.onclick = function ({target}) {
            if (map.has(target)) {
                target.classList.toggle('active');
                let input = map.get(target);
                input.checked = !input.checked;
            }
        };
        root.onmousedown = () => false;
    }
    forSelect(root) {
        let [div, ul, input] = [...root.children];
        this.select = div;
        let liArray = [...ul.children];
        let allObjHtml = new Set([...root.children, ...ul.children]);
        root.onclick = function ({ target }) {
            if (target === div) {
                ul.classList.toggle('visible');
                div.classList.toggle('active');
            }
            let li = liArray.find( li => li === target);
            if (li) {
                div.textContent = li.textContent;
                input.value = li.textContent;
            }
        };
        root.onmousedown = () => false;
        document.addEventListener('click', ({ target }) => {
            if (!allObjHtml.has(target)) {
                ul.classList.add('visible');
                div.classList.remove('active');
            }
        });

    }
    forFileLoad(root) {
        let inputFile = null;
        let inputText = null;
        let button    = null;
        (function findTypeText(root) {
            if (root.type === 'file') {
                inputFile = root;
            }
            if (root.type === 'text') {
                inputText = root;
            }
            if (root.dataset.button !== undefined) {
                button = root;
            }
            if (root.children.length) {
                for(let child of root.children) {
                    findTypeText(child);
                }
            }
        })(root);
        inputFile.onchange = function () {
            inputText.value = this.value;
        }
        inputFile.onfocus = () => {
            button.classList.add('button-hover');
        }
        inputFile.onblur = () => {
            button.classList.remove('button-hover');
        }
    }
    forReset(root) {
        if (root.tagName ==='INPUT'&& root.type !=='checkbox') {
            root.value ='';
        }
        if (root.type === 'checkbox') {
            if (root.checked) {
                root.checked = false;
            }
        }
        if (root.classList.contains('active')) {
            root.classList.remove('active');
        }
        if (root.dataset.textarea !== undefined) {
            root.value ='';
        }
        if (root === this.select) {
            this.select.textContent ='Качества ниже:';
        }
        if (root.children.length) {
            for(let child of root.children) {
                this.forReset(child);
            }
        }
    }
}
let customForm = new CustomForm();
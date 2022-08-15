class AnimateElements {
    reverse = false;
    storageReadyAnimations =  {};
    storageTmFrParametrs   =  {};
    constructor({
       duration = 1000,
       elements = null,
       animationendIn   = [],
       animationstartIn = [],
       animationstartReverse = [],
       animationEndReverse = [],
       animations          = [],
    } = {}) {
        this.duration = duration;
        this.elements = elements;
        this.animationendIn = animationendIn;
        this.animationstartIn = animationstartIn;
        this.animationstartReverse = animationstartReverse;
        this.animationEndReverse = animationEndReverse;
        this.createAnimations(animations,this.storageReadyAnimations);
    }
    // функция определения временных параметров анимации.
    getTmParametrs(tfrac, key) {
        if(!(key in this.storageTmFrParametrs)) {
            this.storageTmFrParametrs[key] = {
                key,
                prev: 0,
                current:0,
                step:0,
            };
        }
        let tf = this.storageTmFrParametrs[key];
        if(!tf.current) {
            tf.current =  tfrac;
        } else {
            tf.prev = tf.current;
            tf.current = tfrac;
            tf.step = Math.abs(tf.current - tf.prev);
        }
    }
    // функция отслеживания шага анимации.
    findGap(timeFraction,key, border1, border2) {
        this.getTmParametrs(timeFraction,key);
        let { current, prev }  = this.storageTmFrParametrs[key];
        if (prev < Math.abs(current)) { // анимация идет прямо
            let border_in =  Math.max(border1, border2);
            return  {
                key,
                border_in,
                change_prop: timeFraction > border1 && timeFraction < border2,
                gap_in: current >= border_in && prev <= border_in,
                gap_reverse: false,
            };
        } else if (prev > current ) { // анимация идет в обратном порядке
            let border_reverse = Math.min(border1, border2);
            return  {
                key,
                border_reverse,
                change_prop: timeFraction > border1 && timeFraction < border2,
                gap_reverse: current <= border_reverse && prev >= border_reverse,
                gap_in: false,
            };
        } else {
            return  {
                key,
                gap_in: false,
                gap_reverse: false,
            };
        }
    }
    // функция выполнения анимации объекта-кадра.
    animateElement({ element,key, timeFraction, border1,border2, prop, value1,value2, measure,transform1, transform2 } = {}) {
        let { change_prop, gap_in, gap_reverse } = this.findGap(timeFraction, key,border1,border2);
        let { style }  = element;
        if (change_prop) {
            if( isFinite(value1) && isFinite(value2)) { // для свойств с цифровыми значениями.
                if (value1 || value2) {
                    let distance = value2 - value1;
                    let value =  (value1 +(distance *(timeFraction-border1)*(1/(border2 - border1)))).toFixed(2);
                    style[prop] = transform1 ? transform1 +   value  + measure  : measure ? value + measure : value;
                }
            }
            if(!value1 && !value2  && transform1 && transform2) { // для свойств типа position:fixed;
                !style[prop] &&(style[prop] = transform1);
            }
        } else if (gap_in) {
            if (isFinite(value1) && isFinite(value2)) {
                style[prop] = transform1 ? transform1 + value2 + measure : measure  ? value2 + measure : value2;
            }
            if(!value1 && !value2  && transform1 && transform2) {
                style[prop] = transform2;
            }
        } else if(gap_reverse) {
            if (isFinite(value1) && isFinite(value2)) {
                style[prop]  = transform1 ? transform1 +  value1  + measure   : measure  ? value1 + measure : value1;
            }
            if(!value1 && !value2  && transform1 && transform2) {
                style[prop] = transform1;
            }
        }
    }
    // линейная функция выполнения анимации
    timing(timeFraction) {
        return  Number(timeFraction.toFixed(3));
    }
    // линейная функция выполнения анимации в обратном порядке.
    timingReverse(timeFraction) {
        return Number((1 -  timeFraction).toFixed(2));
    }
    // выполнение готовых кадров анимации.
    drawAn(storage, timeFraction) {
        if(!this.isEmptyObject(storage)) {
            Object.keys(storage).forEach((animation) => {
                if(Array.isArray(storage[animation])) {
                    storage[animation].forEach((keyframe) => {
                        if (typeof keyframe ==="object" && keyframe !== null) {
                            keyframe.timeFraction = timeFraction;
                            this.animateElement(keyframe);
                        }
                    });
                }
            })
        }
    }
    // функция выполнения анимации.
    animate({ duration = this.duration } = {}) {
        let start = performance.now();
        let needThis = this;
        let {
            animationstartIn,
            animationstartReverse,
            animationendIn,
            animationEndReverse,
            elements,
            timing,
            timingReverse,
            storageReadyAnimations,
            reverse
        } = this;
        if(!reverse) { // выполняем до начала анимации в обычном порядке.
            Array.isArray(animationstartIn) && animationstartIn.length && animationstartIn.forEach(func => func(elements));
        }
        if (reverse) { // выполняем до начала анимации в обратном порядке.
            Array.isArray(animationstartReverse) && animationstartReverse.length && animationstartReverse.forEach(func=> func(elements));
        }
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration ;
            if (timeFraction > 1) {
                timeFraction = 1;
            }
            let progress;
            if(!reverse) {
                progress = timing(timeFraction);
            } else {
                progress = timingReverse(timeFraction);
            }
            needThis.drawAn(storageReadyAnimations,progress);
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                if(!reverse) { // выполняем после анимации в обычном порядке.
                    Array.isArray(animationendIn) && animationendIn.length && animationendIn.forEach(func => func(elements));
                }
                if(reverse) { // выполняем после обратной анимации.
                    Array.isArray(animationEndReverse) && animationEndReverse.length && animationEndReverse.forEach(func => func(elements));
                }
                // меняем флаг выполнения  анимации.
                needThis.reverse = !needThis.reverse;
            }
        });
    }
    // создание анимаций из объектов
    createAnimations(arrayWithObjectsOfAnimations,storageReadyAnimations) {
        if(Array.isArray(arrayWithObjectsOfAnimations) && arrayWithObjectsOfAnimations.length) {
            arrayWithObjectsOfAnimations.forEach(object_animation => {
                this.createArrKeyFramesAnimation(object_animation,storageReadyAnimations);
            });
        }
    }
    // создание анимации из объекта .
    createOneAnimation(object_animation) {
        if (typeof object_animation === "object" && object_animation !== null) {
            this.createArrKeyFramesAnimation(object_animation, this.storageReadyAnimations);
        }
    }
    // создаем-объекты кадры анимации и записываем в хранилище для дальнейшего выполнения.
    createArrKeyFramesAnimation(animation,storage) {
        let readyKeyFrames = []; // готовые кадры.
        let { element } = animation; //  элемент к которому будет применятся анимация.
        let [,animationName] = Object.keys(animation); //имя анимации.
        let keyframes = Object.entries(animation[animationName]);//кадры анимации.
        for (let i = 0 ; i <= keyframes.length - 2; i++) {
            for (let y= i+1; y < keyframes.length; y++) {
                this.createObjectsKeyFrames(keyframes[i],keyframes[y],animationName,element,readyKeyFrames);
            }
        }
        storage[animationName] = readyKeyFrames;
    }
    // создание кадра-объекта для каждого свойства.
    createObjectsKeyFrames(obj_1, obj_2,animationName,element,ready) {
        let [percent_1, props_1] = obj_1;
        let [percent_2, props_2] = obj_2;
        let keys_2  = Object.keys(props_2);
        for (let key of Object.keys(props_1)) {
            if(keys_2.includes(key)) {
                let { transform:transform1,value,measure } = this.getParForAnimation(props_1[key]);
                let { value:value2,transform:transform2 }  = this.getParForAnimation(props_2[key]);
                ready.push({
                    element,
                    key: animationName + key + percent_1 + percent_2 ,
                    timeFraction: 0,
                    border1 : +(percent_1.match(/^\d+/))/100,
                    border2:  +(percent_2.match(/^\d+/))/100,
                    prop: key,
                    value1:  +value,
                    value2:  +value2,
                    measure,
                    transform1,
                    transform2,
                });
                delete props_1[key];
            }
        }
    }
    // измнение значений уже готовых анимаций.
    changeReadyObjectskeyFrames (animationName,property, percent1, percent2,value1 = 0, value2 = 0 ) {
        if (this.storageReadyAnimations ) {
            let key = animationName + property + percent1 + percent2;
            let animation = this.storageReadyAnimations[animationName];
            if (animation && Array.isArray(animation)) {
                animation.forEach(keyframes => {
                    if (keyframes.key === key) {
                        value1 && (keyframes.value1 = value1);
                        value2 && (keyframes.value2 = value2);
                    }
                });
            }
       }
    }
    getParForAnimation(str) {
        let regexp = /(?<transform>[a-zA-Z(]+)?(?<value>[-\d.]+)?(?<measure>[a-zA-Z)%]+)?/;
        return str.replace(/ /g,'').match(regexp).groups;
    }
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
}
class AnimationScroll {
    constructor({ animationstart = [],animationend = [],elements = null } = {}) {
        this.elements = elements;
        this.animationstart = animationstart;
        this.animationend = animationend;
    }
    getscrollHeight() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight,
        );
    }
    getscrollWidth() {
        return Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth,
        );
    }
    timing(timeFraction) {
        return  Number(timeFraction.toFixed(2));
    }
    animate({ duration = 1000, funcScroll = () => { console.log("функция не назначена.")}} = {}) {
        let start = performance.now();
        let { animationstart, elements, animationend, timing } = this;
        // выполняем до начала анимации
        Array.isArray(animationstart) && animationstart.length && animationstart.forEach(func => func(elements));
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration ;
            if (timeFraction > 1) {
                timeFraction = 1;
            }
            let progress = timing(timeFraction);
            funcScroll(progress);
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                // выполняем после анимации .
                Array.isArray(animationend) && animationend.length && animationend.forEach(func => func(elements));
            }
        });
    }
    scrollPageYUp(duration) {
        let scrollTop = pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        function scroll(progress) {
            scrollTop && window.scrollTo(0,scrollTop - (scrollTop*progress));
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
    scrollpageYDown(duration) {
        let scrollTop = pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let height_page = this.getscrollHeight();
        let height_window = document.documentElement.clientHeight;
        let scrollBottom = height_page - scrollTop - height_window ;
        function scroll(progress) {
            scrollBottom && window.scrollTo(0, scrollBottom*progress + scrollTop);
        }
        this.animate({
            duration,
            funcScroll: scroll
        });
    }
    scrollPageXLeft (duration) {
        let scrollLeft = pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        function scroll(progress) {
            scrollLeft && window.scrollTo(scrollLeft-(scrollLeft*progress),0);
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
    scrollPageXRight(duration) {
        let scrollLeft = pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        let width_page = this.getscrollWidth();
        let width_window = document.documentElement.clientWidth;
        let scrollRight = width_page - scrollLeft - width_window;
        function scroll(progress) {
            scrollRight &&  window.scrollTo(scrollRight*progress + scrollLeft,0);
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
    scrollBeforeElementY(element, duration) {
        console.log(element);
        let top  = element.getBoundingClientRect().top;
        let distance = top + window.pageYOffset;
        function scroll(progress){
            distance &&  window.scrollTo(0, distance*progress);
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
    elementScrollByX(element,distanss,duration,direction) {
        let scrollLeft = element.scrollLeft;
        let scrollRight = element.scrollWidth - element.scrollLeft - element.clientWidth;
        if(direction ==="left" && !scrollRight) {
            return;
        }
        if(direction ==="right" && !scrollLeft) {
            return;
        }
        function scroll(progress) {
            if (direction ==="left") {
                element.scrollLeft = scrollLeft + distanss*progress;
            } else if  (direction === "right") {
                element.scrollLeft = scrollLeft - distanss*progress;
            }
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
    elementScrollByY(element,distanss, duration,direction) {
        let scrollTop = element.scrollTop;
        let scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        if(direction === "up" && !scrollTop) {
            return;
        }
        if(direction ==="down" && !scrollBottom) {
            return;
        }
        function scroll(progress) {
            if (direction === "down" && scrollBottom) {
                element.scrollTop = scrollTop + distanss*progress;
            } else if  (direction === "up" && scrollTop) {
                element.scrollTop = scrollTop - distanss*progress;
            }
        }
        this.animate({
            duration,
            funcScroll:scroll,
        });
    }
}
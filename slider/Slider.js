class Slider {
    deleteListeners = {};
    root = null;
    runner = null;
    constructor({
                    classes = {
                        slider:["slider"],
                        runner:["runner"],
                    },
                    wherePaste = document.body,
                    methodPaste = "append",
                } = {} ) {
        this.classes = classes;
        this.wherePaste = wherePaste;
        this.methodPaste = methodPaste;
        this.addListeners();
    }
    addListeners([slider,runner] = this.createHtml(this.classes)) {
        this.root = slider;
        this.runner = runner;
        let coord = this.getAbsoluteCords(slider);

        runner.addEventListener("dragstart", this.onDrugstart);
        runner.addEventListener("mousedown",this.onMousedown(slider, runner, coord));

        if (this.wherePaste instanceof Element && this.wherePaste[this.methodPaste]) {
            this.wherePaste[this.methodPaste](slider);
        }
    }
    createHtml(classes) {
        let slider = document.createElement("div");
        slider.className = classes.slider.join(" ");
        let runner = document.createElement("div");
        console.log(runner);
        runner.className = classes.runner.join(" ");
        slider.append(runner);
        return [slider, runner];
    }
    onMousedown(slider, runner, coord) {
        let contextClass = this;
        return function(event) {
            event.preventDefault();
            //let coord = contextClass.getAbsoluteCords(slider);
            let shiftX = contextClass.getShift(runner, event);
            document.addEventListener("mousemove", contextClass.onMousemove(shiftX, coord, slider, runner));
            document.addEventListener("mouseup", contextClass.onMouseup());
        }
    }
    onMousemove(shiftX, coord, slider, runner) {
        function move (event) {
            console.log("moove",runner.style.left);
            let left = event.pageX - shiftX - coord.left, right;
            if (left < 0) {
                left = 0;
            }
            if (left > (right = (slider.offsetWidth - runner.offsetWidth))) {
                //console.log("right", right);
                left = right;
            }
            runner.style.left = left +"px";
        }
        this.deleteListeners.move = move;
        return move;
    }
    onMouseup(onMousemove) {
        let contextClass = this;
        return function up ()  {
            document.removeEventListener("mousemove", contextClass.deleteListeners.move);
            document.removeEventListener("mouseup", up);
            delete contextClass.deleteListeners.move;
        };
    }
    onDrugstart() {
        return false;
    }
    getShift(runner, event) {
        let { left }  =  this.getAbsoluteCords(runner);
        return  event.pageX - left ;
    }
    getAbsoluteCords(htmlObj) {
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
    remove() {
        this.root.remove();
        this.runner.removeEventListener("dragstart", this.onDrugstart);
    }
}
new Slider();
let up = document.getElementById("up");
let before = document.getElementById("before");
let aft = document.getElementById("aft");
let contaner = document.getElementById("contaner");
let next = document.getElementById("next");
let prev = document.getElementById("prev");

before.onclick = () => {
    anscroll.scrollBeforeElementY(aft,1000);
};
next.onclick = () => {
    anscroll.elementScrollByX(contaner,200,300,"left");
};
prev.onclick = () => {
    anscroll.elementScrollByX(contaner,200,300,"right");
};
window.onload = () => {
    prev.style.display ="none";
}
let anscroll = new AnimationScroll({
    elements:{
        prev,
        next,
        contaner,
    },
    animationend:[hiddenPrev, hiddenNext],
});
function hiddenPrev(elements) {
    let{ prev:{ style }, contaner:{ scrollLeft } } = elements;
    if(!scrollLeft) {
        style.display = "none";
    } else {
        style.display = "block";
    }
}
function hiddenNext(elements) {
    let{ contaner : { scrollWidth, scrollLeft,clientWidth }, next: { style } } = elements;
    let scrollBottom = scrollWidth - scrollLeft - clientWidth;
    if(!scrollBottom) {
        style.display = "none";
    } else {
        style.display ="block";
    }
}
function pageDown() {
    anscroll.scrollpageYDown(1000);
}
function pageUp() {
    anscroll.scrollPageYUp(1000);
}
function  pageRight() {
    anscroll.scrollPageXRight(1000);
}
function  pageLeft() {
    anscroll.scrollPageXLeft(1000);
}
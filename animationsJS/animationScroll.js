let b = document.getElementById("b");

b.onclick = () => {

    animate({
        timing,
        draw,
        duration:1000
    });
};
let prev = 0;
function draw(progress, pageY) {
    b.style.backgroundColor ="gray";
    let value_progress = progress * pageY;
    let current_scroll = value_progress - prev;
    prev = value_progress;
    window.scrollBy(0, -current_scroll);
}

function timing(timeFraction) {
    return timeFraction;
}

function animate({ timing, draw, duration}) {
    let start = performance.now();
    let pageY = pageYOffset;
    requestAnimationFrame(function  animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) {
            timeFraction = 1;
        }
        let progress = timing(timeFraction);
        draw (progress, pageY);
        if (timeFraction < 1) {
           requestAnimationFrame(animate);
        } else {
            b.style.backgroundColor ="blue";
            console.log("the end animation");
            prev = 0;
        }
    });
}
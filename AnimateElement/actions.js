{
    "use strict";
    let elements = SerchElements({
        funcSerchFirstElement: searchfirstElement,
        funcSerchElements: searchOthersElements,
        accum:{},
    });
   // console.log("elements",elements);
    let an = new AnimateElements({
        duration: 1000,
        elements: elements.buttonAn,
        animationEndReverse: [deletePosition],
        animations: createAnimationLines(getTopLines(elements)),
    });

    let media_list = window.matchMedia("(min-width:510px)");
    media_list.addListener(media);

    function clickHandler() {
        let left = getFixedCoordElement("left",elements.buttonAn);
        let top = getFixedCoordElement("top",elements.buttonAn);
        let new_left = getLeftForPositinFixed(50) + 10;
        elements.contanerItems.classList.toggle("menu-an__contaner-items_show");
        elements.overlay.classList.toggle("overlay_show");
        //let width = getStylePropertiesFromCSS("width",items);
        //console.log("width",width);
        !an.reverse && an.createOneAnimation({
            element:elements.buttonAn,
            contaner: {
                "0%": {
                    left: left + "px",
                    top:  top +"px",
                    borderRadius:  10 + "%",
                    position:"fixed",
                    backgroundColor:"olivedrab",
                },
                "100%": {
                    top: top + "px",
                    left: new_left + "px",
                    borderRadius: 50 + "%",
                    position: "fixed",
                    backgroundColor: "red",
                }
            },
        });
        an.animate({
            duration: 700,
        });
    }
    window.addEventListener("resize",() => {
        if (an.reverse) {
            let left = getLeftForPositinFixed(50) + 10;
            elements.buttonAn.style.left = left + "px";
            an.changeReadyObjectskeyFrames("contaner","left","0%","100%",0,left);
        }
    });
    function media(media_list) {
        if(media_list.matches) {
            if(an.reverse) {
                an.animate({duration:100});
                elements.contanerItems.classList.toggle("menu-an__contaner-items_show");
                elements.overlay.classList.toggle("overlay_show");
            }
        }
    }
    function deletePosition (elements)  {
        let { style } = elements;
        style.position = "";
        style.top = "";
        style.left = "";
   }
}
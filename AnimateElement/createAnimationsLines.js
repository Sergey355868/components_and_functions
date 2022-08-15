function createAnimationLines(linesAndDistance) {
    let [line_middle, dimensions_middle] = linesAndDistance.middle;
    let [line_top,  dimensions_top ]  = linesAndDistance.top;
    let [line_bottom] = linesAndDistance.bottom;
    let { top:top_top, middle_distance:middle_distance_top } = dimensions_top;
    let { top, bottom_top } = dimensions_middle;

    let bottom_line = {
        element: line_bottom,
        bottom_line: {
            "0%": {
                opacity: "1",
            },
            "50%": {
                opacity: "0",
            }
        }
    };
    let middle_line = {
        element:line_middle,
        middle_line: {
            "0%": {
                top: top +"px",
                backgroundColor:"black",
            },
            "33%": {
                top: bottom_top +"px",
            },
            "66%": {
                top: top +"px" ,
                transform: "rotate(0deg)"
            },
            "100%": {
                transform: "rotate(-45deg)",
                backgroundColor:"white",
            }
        }
    }
    let top_line = {
        element:line_top,
        line_top: {
            "0%": {
                top: top_top +"px" ,
                backgroundColor:"black",
            },
            "33%": {
                top:  bottom_top +"px"
            },
            "66%": {
                top:(bottom_top - middle_distance_top) +"px",
                transform: "rotate(0deg)"
            },
            "100%": {
                transform: "rotate(45deg)",
                backgroundColor:"white"
            }
        }
    };

    return [top_line,middle_line,bottom_line];
}

function getTopLines(elements) {
    let linesAndDistance = {
        top:"",
        middle:"",
        bottom:"",
    };
    let { middle,bottom } = elements;
    let bottom_top  = getStylePropertiesFromCSS("top",bottom);
    let middle_top  = getStylePropertiesFromCSS("top",middle);
    Object.keys(linesAndDistance).forEach(key => {
        let top = getStylePropertiesFromCSS("top",elements[key]);
        linesAndDistance[key] = [
            elements[key],
            {
                middle_distance: bottom_top - middle_top,
                bottom_top,
                top,
                bottom_distance: bottom_top - top,
            },
        ];
    });
    return linesAndDistance;
}
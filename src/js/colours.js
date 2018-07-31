(function (fluid){
    "use strict";

    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.colours");

    /*

        Velocities are 7-bit numbers which can be used to set colours as follows:

        6: must be set to 0
        5-4: green brightness, where 00 is off, 01 is low brightness, 10 is medium brightness, and 11 is high brightness
        3 1: clear other buffer's copy of this LED 0: leave it alone
        2 1: write this note to both buffers 0: leave it alone
        1-0: red brightness, where 00 is off, 01 is low brightness, 10 is medium brightness, and 11 is high brightness

     */

    // HTML colours by velocity, ae = off, c9 = low, e4 = medium, ff = high
    flockquencer.colours.htmlByVelocity = {
        0:  "#aeaeae", // No Red, No Green -> Neutral unlit plastic colour
        1:  "#c90000", // Low Red, No Green -> Brown
        2:  "#e40000", // Medium Red, No Green -> Medium Red
        3:  "#ff0000", // High Red, No Green -> High Red
        16: "#00c900", // No Red, Low Green -> Low Green
        17: "#c9c900", // Low Red, Low Green -> Low Yellow
        18: "#e4c900", // Medium Red, Low Green
        19: "#ffc900", // High Red, Low Green
        32: "#00e400", // No Red, Medium Green -> Medium Green
        33: "#c9e400", // Low Red, Medium Green
        34: "#e4e400", // Medium Red, Medium Green -> Medium Yellow
        35: "#ffe400", // High Red, Medium Green
        48: "#00ff00", // No Red, High Green -> Bright Green
        49: "#c9ff00", // Low Red, High Green
        50: "#e4ff00", // Medium Red, High Green
        51: "#ffff00"  // High Red, High Green -> Bright Yellow
    };
})(fluid);

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
        0:  "#aeaeae", // No Red, No Green
        1:  "#a30000", // Low Red, No Green
        2:  "#c90000", // Medium Red, No Green
        3:  "#ff0000", // High Red, No Green
        16: "#00a300", // No Red, Low Green
        17: "#a3a300", // Low Red, Low Green
        18: "#c9a300", // Medium Red, Low Green
        19: "#ffa300", // High Red, Low Green
        32: "#00c900", // No Red, Medium Green
        33: "#a3c900", // Low Red, Medium Green
        34: "#c9c900", // Medium Red, Medium Green
        35: "#ffc900", // High Red, Medium Green
        48: "#00ff00", // No Red, High Green
        49: "#a3ff00", // Low Red, High Green
        50: "#c9ff00", // Medium Red, High Green
        51: "#ffff00"  // High Red, High Green
    };

    // Convenience names for colours to keep them consistent.
    flockquencer.colours.velocityByName = {
        BLACK:         0,  // No Red, No Green
        LOW_RED:       1,  // Low Red, No Green
        MEDIUM_RED:    2,  // Medium Red, No Green
        BRIGHT_RED:    3,  // High Red, No Green
        LOW_GREEN:     16, // No Red, Low Green
        LOW_BROWN:     17, // Low Red, Low Green
        LOW_ORANGE:    18, // Medium Red, Low Green
        RED_ORANGE:    19, // High Red, Low Green
        MEDIUM_GREEN:  32, // No Red, Medium Green
        LOW_YELLOW:    33, // Low Red, Medium Green
        MEDIUM_BROWN:  34, // Medium Red, Medium Green
        MEDIUM_ORANGE: 35, // High Red, Medium Green
        BRIGHT_GREEN:  48, // No Red, High Green
        MEDIUM_YELLOW: 49, // Low Red, High Green
        BRIGHT_YELLOW: 50, // Medium Red, High Green
        BRIGHT_ORANGE: 51  // High Red, High Green
    }
})(fluid);

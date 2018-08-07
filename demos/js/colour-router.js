(function (fluid) {
    "use strict";

    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.demo.colourRouter");

    flockquencer.demo.colourRouter.paintNotes = function (that) {
        fluid.each(that.options.coloursByNote, function (colourKey, note) {
            var notePaintMessage = {
                type:     "noteOn",
                note:     note,
                velocity: flockquencer.colours.velocityByName[colourKey]
            };
            that.uiOutput.send(notePaintMessage);
            that.onscreen.events.uiNote.fire(notePaintMessage);
        });
    };

    fluid.defaults("flockquencer.demo.colourRouter", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            uiOutput: ".ui-output"
        },
        /*
        BRIGHT_GREEN
        BRIGHT_ORANGE
        MEDIUM_ORANGE
        RED_ORANGE
        HIGH_RED
        LOW_RED

         */
        coloursByNote: {
            // Eighth (Top) Row
            0: "BLACK",
            1: "BLACK",
            2: "BLACK",
            3: "BLACK",
            4: "LOW_RED",
            5: "LOW_RED",
            6: "LOW_RED",
            7: "LOW_RED",
            // Seventh row
            16: "MEDIUM_RED",
            17: "MEDIUM_RED",
            18: "MEDIUM_RED",
            19: "MEDIUM_RED",
            20: "BRIGHT_RED",
            21: "BRIGHT_RED",
            22: "BRIGHT_RED",
            23: "BRIGHT_RED",
            // Sixth row
            32: "LOW_GREEN",
            33: "LOW_GREEN",
            34: "LOW_GREEN",
            35: "LOW_GREEN",
            36: "LOW_BROWN",
            37: "LOW_BROWN",
            38: "LOW_BROWN",
            39: "LOW_BROWN",
            // Fifth row
            48: "LOW_ORANGE",
            49: "LOW_ORANGE",
            50: "LOW_ORANGE",
            51: "LOW_ORANGE",
            52: "RED_ORANGE",
            53: "RED_ORANGE",
            54: "RED_ORANGE",
            55: "RED_ORANGE",
            // Fourth row
            64: "MEDIUM_GREEN",
            65: "MEDIUM_GREEN",
            66: "MEDIUM_GREEN",
            67: "MEDIUM_GREEN",
            68: "LOW_YELLOW",
            69: "LOW_YELLOW",
            70: "LOW_YELLOW",
            71: "LOW_YELLOW",
            // Third row
            80: "MEDIUM_BROWN",
            81: "MEDIUM_BROWN",
            82: "MEDIUM_BROWN",
            83: "MEDIUM_BROWN",
            84: "MEDIUM_ORANGE",
            85: "MEDIUM_ORANGE",
            86: "MEDIUM_ORANGE",
            87: "MEDIUM_ORANGE",
            // Second row
            96:  "BRIGHT_GREEN",
            97:  "BRIGHT_GREEN",
            98:  "BRIGHT_GREEN",
            99:  "BRIGHT_GREEN",
            100: "MEDIUM_YELLOW",
            101: "MEDIUM_YELLOW",
            102: "MEDIUM_YELLOW",
            103: "MEDIUM_YELLOW",
            // First (bottom) row
            112: "BRIGHT_YELLOW",
            113: "BRIGHT_YELLOW",
            114: "BRIGHT_YELLOW",
            115: "BRIGHT_YELLOW",
            116: "BRIGHT_ORANGE",
            117: "BRIGHT_ORANGE",
            118: "BRIGHT_ORANGE",
            119: "BRIGHT_ORANGE"
        },
        components: {
            enviro: {
                type: "flock.enviro"
            },
            uiOutput: {
                type: "flockquencer.connector",
                container: "{that}.dom.uiOutput",
                options: {
                    portType: "output",
                    components: {
                        midiPortSelector: {
                            options: {
                                strings: {
                                    selectBoxLabel: "UI Output",
                                }
                            }
                        },
                        connection: {
                            options: {
                                listeners: {
                                    "onReady.paintDevice": {
                                        funcName: "flockquencer.demo.colourRouter.paintNotes",
                                        args:     ["{flockquencer.demo.colourRouter}"]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onscreen: {
                type: "flockquencer.onscreen",
                container: ".flockquencer-onscreen"
            }
        }
    });
})(fluid);

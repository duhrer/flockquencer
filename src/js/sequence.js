// TODO: Collapse this back into a well-documented data structure that does not require separate components.
(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.sequence");
    flockquencer.sequence.status = {
        PLAYING:  "playing",
        STARTING: "starting",
        STOPPED:  "stopped",
        STOPPING: "stopping"
    };

    fluid.defaults("flockquencer.sequence", {
        gradeNames: ["fluid.component"],
        members: {
            // Empty steps for all possible steps, i.e. up to the max supported length of 64.
            steps: {
                0:  {},
                1:  {},
                2:  {},
                3:  {},
                4:  {},
                5:  {},
                6:  {},
                7:  {},
                8:  {},
                9:  {},
                10: {},
                11: {},
                12: {},
                13: {},
                14: {},
                15: {},
                16: {},
                17: {},
                18: {},
                19: {},
                20: {},
                21: {},
                22: {},
                23: {},
                24: {},
                25: {},
                26: {},
                27: {},
                28: {},
                29: {},
                30: {},
                31: {},
                32: {},
                33: {},
                34: {},
                35: {},
                36: {},
                37: {},
                38: {},
                39: {},
                40: {},
                41: {},
                42: {},
                43: {},
                44: {},
                45: {},
                46: {},
                47: {},
                48: {},
                49: {},
                50: {},
                51: {},
                52: {},
                53: {},
                54: {},
                55: {},
                56: {},
                57: {},
                58: {},
                59: {},
                60: {},
                61: {},
                62: {},
                63: {}
            },
            // Set the length separately so that we can preserve out of bounds notes when editing.
            length: 16,
            // The MIDI Channel on which we will send our output.
            channel: 0,
            // The status of the sequence, see above for values.
            status: flockquencer.sequence.status.STOPPED
        }
    })
})(fluid);

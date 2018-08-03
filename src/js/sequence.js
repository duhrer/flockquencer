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

    // blank sequence that can be merged with any existing sequence
    flockquencer.sequence.blankSequence = {
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
    };

    flockquencer.sequence.newSequence = function () {
        return fluid.copy(flockquencer.sequence.blankSequence);
    };

    // An expander to merge partial sequence options with the defaults.
    flockquencer.sequence.mergeWithDefaults = function (sequenceOptions) {
        return fluid.extend({}, flockquencer.sequence.blankSequence, sequenceOptions);
    };

    flockquencer.sequence.getRootNote = function (sequence) {
        if (sequence.rootNote) {
            return sequence.rootNote;
        }
        else if (sequence.steps) {
            return fluid.find(sequence.steps, function (step) {
                if (fluid.get(step, "notes.length")) {
                    return step.notes[0];
                }
            });
        }
    };
})(fluid);

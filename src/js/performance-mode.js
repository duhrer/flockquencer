(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.mode.performance");

    flockquencer.mode.performance.paintNote = function (that, notePayload) {
        var inputHandlerDef = fluid.get(that.options.controlNotes, fluid.get(notePayload, "note"));
        // Use the input def to handle the display of the note
        if (inputHandlerDef) {
            // TODO: do something.
        }
        // Just make the note "echo" on the device, i.e. flash when press, off when released.
        else {
            that.uiOutput.send(notePayload);
        }
    };


    // TODO: BPM controls and display.  Sub-modes?  Other display buffer?

    flockquencer.mode.performance.sendToControlOutput = function (that, payload) {
        // TODO: Figure out how to handle the notes that are "play buttons" for sequences, i.e. 8, 24, 40, 56, 72, 88, 104, 120

        var inputHandlerDef = fluid.get(that.options.controlNotes, fluid.get(payload, "note"));
        // treat the note input as a control
        if (inputHandlerDef) {
            // TODO: Write this
        }
        // play the note
        // TODO: Test handling of control change messages.
        else {
            var transformedPayload = payload.note !== undefined ? fluid.extend(true, fluid.copy(payload), {note: payload.note + flockquencer.offsets[payload.note] + (that.model.octaveOffset * 12)}) : payload;
            that.controlOutput.send(transformedPayload);
        }
    };

    flockquencer.mode.performance.handleOctaveChange = function (that) {
        var upColour   = 0;
        var downColour = 0;

        // 15: red
        if (that.model.octaveOffset > 0) {
            upColour = 3;
        }
        else if (that.model.octaveOffset < 0) {
            downColour = 3;
        }

        flockquencer.mode.performance.resetNotes(that);

        that.uiOutput.send({type: "control", channel: 0, number: 104, value: upColour});
        that.uiOutput.send({type: "control", channel: 0, number: 105, value: downColour});
    };

    flockquencer.mode.performance.handleControlInput = function (that, controlPayload) {
        if (fluid.get(controlPayload, "value")) {
            switch (fluid.get(controlPayload, "number")) {
                // UP
                case 104:
                    if (that.model.octaveOffset < 2) {
                        that.applier.change("octaveOffset", that.model.octaveOffset + 2);
                    }
                    break;
                // DOWN
                case 105:
                    if (that.model.octaveOffset > -2) {
                        that.applier.change("octaveOffset", that.model.octaveOffset - 2);
                    }
                    break;
            }
        }
    };

    flockquencer.mode.performance.resetNotes = function (that) {
        var resetNotes = {
            type:    "control",
            channel: 0,
            number:  123,
            value:   0
        };
        that.uiOutput.send(resetNotes);
        that.controlOutput.send(resetNotes);
    };

    flockquencer.mode.performance.handleModeChange = function (that) {
        if (that.model.mode === that.options.mode) {
            flockquencer.mode.performance.resetNotes(that);
        }
    };

    fluid.defaults("flockquencer.mode.performance", {
        gradeNames: ["flockquencer.mode"],
        mode: "performance",
        model: {
            octaveOffset: -2,
            mode: "performance"
        },
        controlNotes: {
            // TODO: Define this better as a means of looking up input handlers for each note.
            8: {}, 24: {}, 40: {}, 56: {}, 72: {}, 88: {}, 104: {}, 120: {}
        },
        // TODO: Define this better as we start assembling more modes.
        //controls: {
        //    106: 0,
        //    107: 0,
        //    // TODO: Move this to another "mode select" mode.
        //    108: 127
        //},
        listeners: {
            "note.paintNote": {
                funcName: "flockquencer.mode.performance.paintNote",
                args: ["{that}", "{arguments}.0"] // notePayload
            },
            "note.sendToControlOutput": {
                funcName: "flockquencer.mode.performance.sendToControlOutput",
                args: ["{that}", "{arguments}.0"] // notePayload
            },
            "control.handleControlInput": {
                funcName: "flockquencer.mode.performance.handleControlInput",
                args: ["{that}", "{arguments}.0"] // controlPayload
            },
            "onUiOutputReady.resetNotes": {
                funcName: "flockquencer.mode.performance.resetNotes",
                args:     ["{that}"]
            }
        },
        modelListeners: {
            octaveOffset: {
                excludeSource: "init",
                funcName: "flockquencer.mode.performance.handleOctaveChange",
                args: ["{that}"]
            },
            mode: {
                excludeSource: "init",
                funcName:      "flockquencer.mode.performance.handleModeChange",
                args:         ["{that}"]
            }
        }
    });
})(fluid);

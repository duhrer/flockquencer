(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.mode.performance");

    flockquencer.mode.performance.paintNote = function (that, notePayload) {
        var uiOutputConnection = fluid.get(that, "uiOutput.connection");
        if (uiOutputConnection) {
            var inputHandlerDef = fluid.get(that.options.controlNotes, fluid.get(notePayload, "note"));
            // Use the input def to handle the display of the note
            if (inputHandlerDef) {
                // TODO: do something.
            }
            // Just make the note "echo" on the device, i.e. flash when press, off when released.
            else {
                uiOutputConnection.send(notePayload);
            }
        }
    };

    // TODO: BPM controls and display.  Sub-modes?  Other display buffer?

    // TODO: Initial paint on new connection (clear all notes, refresh octave controls, display mode).

    flockquencer.mode.performance.sendToControlOutput = function (that, payload) {
        // TODO: Figure out how to handle the notes that are "play buttons" for sequences, i.e. 8, 24, 40, 56, 72, 88, 104, 120

        var controlOutputConnection = fluid.get(that, "controlOutput.connection");
        if (controlOutputConnection) {
            var inputHandlerDef = fluid.get(that.options.controlNotes, fluid.get(payload, "note"));
            // treat the note input as a control
            if (inputHandlerDef) {
                // TODO: Write this
            }
            // play the note
            // TODO: Test handling of control change messages.
            else {
                var transformedPayload = payload.note !== undefined ? fluid.extend(true, fluid.copy(payload), {note: payload.note + flockquencer.offsets[payload.note] + (that.model.octaveOffset * 12)}) : payload;
                controlOutputConnection.send(transformedPayload);
            }
        }
    };

    flockquencer.mode.performance.paintOctaveControls = function (that) {
        var uiOutputConnection = fluid.get(that, "uiOutput.connection");
        if (uiOutputConnection) {
            var upColour   = 0;
            var downColour = 0;

            // 15: red
            if (that.model.octaveOffset > 0) {
                upColour = 15;
            }
            else if (that.model.octaveOffset < 0) {
                downColour = 15;
            }

            uiOutputConnection.send({type: "control", channel: 0, number: 104, value: upColour});
            uiOutputConnection.send({type: "control", channel: 0, number: 105, value: downColour});
        }
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

    fluid.defaults("flockquencer.mode.performance", {
        gradeNames: ["flockquencer.mode"],
        mode: "performance",
        model: {
            octaveOffset: -2
        },
        controlNotes: {
            // TODO: Define this better as a means of looking up input handlers for each note.
            8: {}, 24: {}, 40: {}, 56: {}, 72: {}, 88: {}, 104: {}, 120: {}
        },
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
            }
        },
        modelListeners: {
            octaveOffset: {
                excludeSource: "init",
                funcName: "flockquencer.mode.performance.paintOctaveControls",
                args: ["{that}"]
            }
        }
    });
})(fluid);

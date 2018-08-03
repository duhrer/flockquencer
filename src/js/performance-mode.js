(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.mode.performance");

    flockquencer.mode.performance.paintNote = function (that, notePayload) {
        var isSequenceControl = fluid.get(that.options.sequenceControlNotes, fluid.get(notePayload, "note"));
        // Use the input def to handle the display of the note
        if (!isSequenceControl) {
            // Just make the note "echo" on the device, i.e. light it up when pushed, turn it off when released.
            that.uiOutput.send(notePayload);
        }
    };

    flockquencer.mode.performance.toggleSequence = function (that, notePayload) {
        var sequence = that.model.sequences[notePayload.note];
        if (notePayload.type === "noteOn" && notePayload.velocity !== 0) {
            fluid.set(that.controlStartTiming, notePayload.note, Date.now());
        }
        else if (notePayload.type === "noteOff" || notePayload.velocity === 0) {
            var pressDuration = Date.now() - fluid.get(that.controlStartTiming, notePayload.note);

            // If it's already the selected arpeggiation, unselect it and turn it off.
            if (that.selectedArpeggiation === notePayload.note) {
                // Stop all playing arpeggiations.
                that.sequencePlayer.stopAllArpeggiations();
                that.selectedArpeggiation = false;
            }
            else {
                // LONG press on something other than the current arpeggiation pattern, change the pattern.
                if (pressDuration > that.options.longPressCutoff) {
                    // Stop the sequence if it's playing.
                    flockquencer.mode.performance.toggleSequenceStatus(that, notePayload.note, true);
                    that.selectedArpeggiation = notePayload.note;
                }
                // Short press
                else {
                    flockquencer.mode.performance.toggleSequenceStatus(that, notePayload.note);
                }
            }

            // Update the UI with any changes
            that.paintRightColumn();
        }
    };

    flockquencer.mode.performance.toggleSequenceStatus = function (that, sequenceId, stopOnly) {
        var sequence = fluid.copy(that.model.sequences[sequenceId]);
        switch(sequence.status) {
            // Playing, flag it to be stopped.
            case flockquencer.sequence.status.PLAYING:
                sequence.status = flockquencer.sequence.status.STOPPING;
                break;
            // Didn't get the chance to start, just stop it outright.
            case flockquencer.sequence.status.STARTING:
                sequence.status = flockquencer.sequence.status.STOPPED;
                break;
            // Stopped, flag it to be started.
            case flockquencer.sequence.status.STOPPED:
                if (!stopOnly) {
                    sequence.status = flockquencer.sequence.status.STARTING;
                }
                break;
            // Didn't get the chance to stop, just keep playing.
            case flockquencer.sequence.status.STOPPING:
                if (!stopOnly) {
                    sequence.status = flockquencer.sequence.status.PLAYING;
                }
                break;
        }
        that.applier.change(["sequences", sequenceId], sequence);
    };

    // TODO: BPM controls and display.  Sub-modes?  Other display buffer?

    flockquencer.mode.performance.handleNoteInput = function (that, notePayload) {
        var isSequenceControl = fluid.get(that.options.sequenceControlNotes, fluid.get(notePayload, "note"));
        if (isSequenceControl) {
            flockquencer.mode.performance.toggleSequence(that, notePayload);
        }
        else {
            var shiftedNote = notePayload.note + flockquencer.offsets[notePayload.note] + (that.model.octaveOffset * 12);
            if (that.selectedArpeggiation) {
                if (notePayload.type === "noteOn" && notePayload.velocity !== 0) {
                    var selectedPattern  = fluid.get(that.model.sequences, that.selectedArpeggiation);
                    var firstNote = flockquencer.sequence.getRootNote(selectedPattern);
                    var arpPattern = fluid.extend(
                        {},
                        selectedPattern,
                        {
                            status: flockquencer.sequence.status.STARTING,
                            noteOffset: shiftedNote - firstNote
                        }
                    );
                    that.sequencePlayer.arpeggiations[shiftedNote] = arpPattern;
                }
                else if (notePayload.type === "noteOff" || notePayload.velocity === 0) {
                    that.sequencePlayer.arpeggiations[shiftedNote].status = flockquencer.sequence.status.STOPPING;
                }
            }
            else {
                // Just pass the note on to the control output.
                var transformedPayload = notePayload.note !== undefined ? fluid.extend(true, fluid.copy(notePayload), {note: shiftedNote}) : notePayload;
                that.controlOutput.send(transformedPayload);
            }
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
            that.paintRightColumn();
        }
    };

    flockquencer.mode.performance.paintRightColumn = function (that) {
        fluid.each(that.options.sequenceControlNotes, function (isSequence, noteAsString) {
            // TODO: Clean this up somehow
            var note = parseInt(noteAsString);
            var sequence = fluid.get(that.model.sequences, note);
            if (sequence) {
                var noteMessage = {
                    type:     "noteOn",
                    channel:  0,
                    note:     note,
                    velocity: 0
                };

                if (note === that.selectedArpeggiation) {
                    noteMessage.velocity = 18;
                }
                else if (sequence.status === flockquencer.sequence.status.PLAYING || sequence.status === flockquencer.sequence.status.STARTING) {
                    noteMessage.velocity = 32;
                }

                that.uiOutput.send(noteMessage);
            }
        });
    };

    fluid.defaults("flockquencer.mode.performance", {
        gradeNames: ["flockquencer.mode"],
        mode: "performance",
        longPressCutoff: 1000, // Time in ms.
        members: {
            // Used to distinguish between "short" and "long" presses.
            controlStartTiming: {
            },
            // The id (note) of the current selected arpeggiation.
            selectedArpeggiation: false
        },
        model: {
            octaveOffset: -2,
            mode: "performance",
            sequences: {}
        },
        sequenceControlNotes: {
            8:   true,
            24:  true,
            40:  true,
            56:  true,
            72:  true,
            88:  true,
            104: true,
            120: true
        },
        listeners: {
            "note.paintNote": {
                funcName: "flockquencer.mode.performance.paintNote",
                args:     ["{that}", "{arguments}.0"] // notePayload
            },
            "note.handleNoteInput": {
                funcName: "flockquencer.mode.performance.handleNoteInput",
                args:     ["{that}", "{arguments}.0"] // notePayload
            },
            "control.handleControlInput": {
                funcName: "flockquencer.mode.performance.handleControlInput",
                args:     ["{that}", "{arguments}.0"] // controlPayload
            },
            "onUiOutputReady.resetNotes": {
                funcName: "flockquencer.mode.performance.resetNotes",
                args:     ["{that}"]
            }
        },
        modelListeners: {
            octaveOffset: {
                excludeSource: "init",
                funcName:      "flockquencer.mode.performance.handleOctaveChange",
                args:          ["{that}"]
            },
            mode: {
                excludeSource: "init",
                funcName:      "flockquencer.mode.performance.handleModeChange",
                args:          ["{that}"]
            }
        },
        components: {
            sequencePlayer: {
                type: "flockquencer.sequence.player",
                options: {
                    model: {
                        sequences: "{flockquencer.mode.performance}.model.sequences"
                    }
                }

            }
        },
        invokers: {
            paintRightColumn: {
                funcName: "flockquencer.mode.performance.paintRightColumn",
                args:     ["{that}"]
            }
        }
    });
})(fluid);

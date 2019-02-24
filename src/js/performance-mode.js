(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.mode.performance");

    flockquencer.mode.performance.paintNote = function (that, notePayload) {
        var isSequenceControl = fluid.get(that.options.sequenceControlNotes, fluid.get(notePayload, "note"));
        // Use the input def to handle the display of the note
        // TODO: Update this to blank playing notes and repaint on note off
        if (!isSequenceControl) {
            // Blank playing notes.
            if (notePayload.type === "noteOn") {
                that.uiOutput.send({ type: "noteOn", velocity: 0, note: notePayload.note, channel: 0 });
            }
            // Recolour released notes.
            else {
                that.uiOutput.send({
                    channel: 0,
                    type: "noteOn",
                    velocity: flockquencer.colours.velocityByName[that.options.coloursByNote[notePayload.note]],
                    note: notePayload.note
                });
            }
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

        // Silence any already playing notes to avoid "locking" notes from lower octaves in their "on" position.
        flockquencer.mode.performance.resetNotes(that);

        that.uiOutput.send({type: "control", channel: 0, number: 104, value: upColour});
        that.uiOutput.send({type: "control", channel: 0, number: 105, value: downColour});
    };

    flockquencer.mode.performance.handleControlInput = function (that, controlPayload) {
        // Control press.
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
                // Slower tempo.
                case 106:
                    if (that.isChangingTempo) {
                        flockquencer.mode.performance.stopTempoChange(that);
                    }
                    else {
                        flockquencer.mode.performance.startTempoChange(that, -1);
                    }

                    break;
                // Faster tempo.
                case 107:
                    if (that.isChangingTempo) {
                        flockquencer.mode.performance.stopTempoChange(that);
                    }
                    else {
                        flockquencer.mode.performance.startTempoChange(that, 1);
                    }
                    break;
            }
        }
        // Control release.
        else {
            switch (fluid.get(controlPayload, "number")) {
                // Slower tempo.
                case 106:
                // Faster tempo.
                case 107:
                    flockquencer.mode.performance.stopTempoChange(that);
                    break;
            }
        }
    };

    flockquencer.mode.performance.startTempoChange = function (that, direction) {
        that.isChangingTempo = true;
        var startTime = that.tempoChangeScheduler.clock.time;
        that.tempoChangeScheduler.schedule({
            type: "repeat",
            freq: 10,
            callback: function (now) {
                var timeDiff      = (now - startTime);
                var scalingFactor = Math.pow(10, Math.round(Math.max(timeDiff, 1) - 1));
                var scaledIncrement = direction * scalingFactor;
                var newBpm = that.model.bpm + scaledIncrement;
                if (newBpm <= that.options.maxBpm && newBpm >= that.options.minBpm) {
                    that.applier.change("bpm", newBpm);
                }
                else {
                    flockquencer.mode.performance.stopTempoChange(that);
                }
            }
        });
        that.tempoChangeScheduler.start();
    };

    flockquencer.mode.performance.stopTempoChange = function (that) {
        that.tempoChangeScheduler.clearAll();
        that.tempoChangeScheduler.stop();
        that.isChangingTempo = false;
    };

    flockquencer.mode.performance.resetNotes = function (that) {
        that.controlOutput.send({
            type:    "control",
            channel: 0,
            number:  123,
            value:   0
        });
    };

    flockquencer.mode.performance.paintNotes = function (that) {
        fluid.each(that.options.coloursByNote, function (colourKey, note) {
            that.uiOutput.send({
                channel:  0,
                type:     "noteOn",
                note:     note,
                velocity: flockquencer.colours.velocityByName[colourKey]
            });
        });
        that.paintRightColumn();
    };

    flockquencer.mode.performance.handleModeChange = function (that, newValue, oldValue) {
        // We've just become the active mode.  Paint our notes.
        if (newValue === that.options.mode) {
            flockquencer.mode.performance.paintNotes(that);
        }
        // We are no longer the active mode, silence any playing notes.
        else if (oldValue === that.options.mode) {
            // Silence any playing notes to avoid "locking" held notes on mode change (when we can no longer listen for the note to be released).
            flockquencer.mode.performance.resetNotes(that);
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
        minBpm: 1,
        maxBpm: 999,
        longPressCutoff: 1000, // Time in ms.
        coloursByNote: {
            // Eighth (Top) Row
            0: "BRIGHT_ORANGE",
            1: "BRIGHT_ORANGE",
            2: "BRIGHT_ORANGE",
            3: "BRIGHT_ORANGE",
            4: "BRIGHT_GREEN",
            5: "BRIGHT_GREEN",
            6: "BRIGHT_GREEN",
            7: "BRIGHT_GREEN",
            // Seventh row
            16: "BRIGHT_ORANGE",
            17: "BRIGHT_ORANGE",
            18: "BRIGHT_ORANGE",
            19: "BRIGHT_ORANGE",
            20: "BRIGHT_ORANGE",
            21: "BRIGHT_ORANGE",
            22: "BRIGHT_ORANGE",
            23: "BRIGHT_ORANGE",
            // Sixth row
            32: "MEDIUM_BROWN",
            33: "MEDIUM_BROWN",
            34: "MEDIUM_BROWN",
            35: "MEDIUM_BROWN",
            36: "MEDIUM_BROWN",
            37: "MEDIUM_BROWN",
            38: "MEDIUM_BROWN",
            39: "MEDIUM_BROWN",
            // Fifth row
            48: "RED_ORANGE",
            49: "RED_ORANGE",
            50: "RED_ORANGE",
            51: "RED_ORANGE",
            52: "MEDIUM_BROWN",
            53: "MEDIUM_BROWN",
            54: "MEDIUM_BROWN",
            55: "MEDIUM_BROWN",
            // Fourth row
            64: "RED_ORANGE",
            65: "RED_ORANGE",
            66: "RED_ORANGE",
            67: "RED_ORANGE",
            68: "RED_ORANGE",
            69: "RED_ORANGE",
            70: "RED_ORANGE",
            71: "RED_ORANGE",
            // Third row
            80: "BRIGHT_RED",
            81: "BRIGHT_RED",
            82: "BRIGHT_RED",
            83: "BRIGHT_RED",
            84: "BRIGHT_RED",
            85: "BRIGHT_RED",
            86: "BRIGHT_RED",
            87: "BRIGHT_RED",
            // Second row
            96:  "LOW_RED",
            97:  "LOW_RED",
            98:  "LOW_RED",
            99:  "LOW_RED",
            100: "BRIGHT_RED",
            101: "BRIGHT_RED",
            102: "BRIGHT_RED",
            103: "BRIGHT_RED",
            // First (bottom) row
            112: "LOW_RED",
            113: "LOW_RED",
            114: "LOW_RED",
            115: "LOW_RED",
            116: "LOW_RED",
            117: "LOW_RED",
            118: "LOW_RED",
            119: "LOW_RED"
        },
        members: {
            // Used to distinguish between "short" and "long" presses.
            controlStartTiming: {
            },
            // The id (note) of the current selected arpeggiation.
            selectedArpeggiation: false,
            // Whether we are currently changing the tempo.
            isChangingTempo: false
        },
        model: {
            octaveOffset: -2,
            mode: "performance",
            sequences: {},
            bpm: 120
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
            "onUiOutputReady.paintNotes": {
                funcName: "flockquencer.mode.performance.paintNotes",
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
                args:          ["{that}", "{change}.value", "{change}.oldValue"]
            }
        },
        components: {
            sequencePlayer: {
                type: "flockquencer.sequence.player",
                options: {
                    model: {
                        bpm:       "{flockquencer.mode.performance}.model.bpm",
                        sequences: "{flockquencer.mode.performance}.model.sequences"
                    }
                }

            },
            tempoChangeScheduler: {
                type: "berg.scheduler",
                options: {
                    components: {
                        clock: {
                            // TODO: pair with Colin and get this working
                            //type: "berg.clock.autoAudioContext"
                            type: "berg.clock.raf",
                            options: {
                                freq: 10 // times per second
                            }
                        }
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

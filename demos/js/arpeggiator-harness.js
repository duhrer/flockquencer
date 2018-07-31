(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.demo.arpeggiator.harness");

    flockquencer.demo.arpeggiator.harness.handleNoteOn = function (that, payload) {
        var firstNote = fluid.get(that, "options.tremolo.steps.0.notes.0");

        var noteRelativeSequence = fluid.copy(that.options.tremolo);
        // set sequence.noteOffset
        noteRelativeSequence.noteOffset = payload.note - firstNote;
        that.sequencerPlayer.arpeggiations[payload.note] = noteRelativeSequence;
    };

    flockquencer.demo.arpeggiator.harness.handleNoteOff = function (that, payload) {
        that.sequencerPlayer.arpeggiations[payload.note].status = flockquencer.sequence.status.STOPPING;
    };

    fluid.defaults("flockquencer.demo.arpeggiator.harness", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            controlInput: ".control-input",
            controlOutput: ".control-output"
        },
        tremolo: {
            length: 1,
            steps: {
                0: {
                    notes: [ 67 ]
                }
            },
            status: flockquencer.sequence.status.STARTING
        },
        distributeOptions: [
            // Distribute the control output (note player) to all modes.
            {
                record: "{flockquencer.demo.arpeggiator.harness}.controlOutput",
                target: "{that flockquencer.sequence.player}.options.components.controlOutput"
            }
        ],
        components: {
            enviro: {
                type: "flock.enviro"
            },
            controlInput: {
                type: "flock.ui.midiConnector",
                container: "{that}.dom.controlInput",
                options: {
                    portType: "input",
                    components: {
                        midiPortSelector: {
                            options: {
                                strings: {
                                    selectBoxLabel: "Note Input",
                                }
                            }
                        },
                        connection: {
                            options: {
                                listeners: {
                                    noteOn: {
                                        funcName: "flockquencer.demo.arpeggiator.harness.handleNoteOn",
                                        args:     ["{flockquencer.demo.arpeggiator.harness}", "{arguments}.0"]
                                    },
                                    noteOff: {
                                        funcName: "flockquencer.demo.arpeggiator.harness.handleNoteOff",
                                        args:     ["{flockquencer.demo.arpeggiator.harness}", "{arguments}.0"]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            controlOutput: {
                type: "flockquencer.connector",
                container: "{that}.dom.controlOutput",
                options: {
                    portType: "output",
                    components: {
                        midiPortSelector: {
                            options: {
                                strings: {
                                    selectBoxLabel: "Note Output",
                                }
                            }
                        }
                    }
                }
            },
            sequencerPlayer: {
                type: "flockquencer.sequence.player",
                options: {
                    model: {
                        bpm: 750
                    },
                    members: {
                        arpeggiations: {}
                    },
                    listeners: {
                        "onCreate.start": {
                            func: "{that}.start"
                        }
                    }
                }
            }
        }
    });
})(fluid);

(function (fluid) {
    "use strict";

    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.router");

    flockquencer.router.distributeModalEvent = function (that, event, payload) {
        fluid.visitComponentChildren(that, function (childComponent, name) {
            if (fluid.componentHasGrade(childComponent, "flockquencer.mode")) {
                var childComponentMode = fluid.get(childComponent, "options.mode");
                if (childComponentMode === "*" || that.model.mode === childComponentMode) {
                    childComponent.events[event].fire(payload);
                    //if (payload.type && payload.type !== event) {
                    //    childComponent.events[payload.type].fire(payload);
                    //}
                }
            }
        }, { flat: true });
    };

    fluid.defaults("flockquencer.router", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            mode: "performance",
            octaveOffset: 0,
            sequences: {
                8:   "@expand:flockquencer.sequence.newSequence()",
                24:  "@expand:flockquencer.sequence.newSequence()",
                40:  "@expand:flockquencer.sequence.newSequence()",
                56:  "@expand:flockquencer.sequence.newSequence()",
                72:  "@expand:flockquencer.sequence.newSequence()",
                88:  "@expand:flockquencer.sequence.newSequence()",
                104: "@expand:flockquencer.sequence.newSequence()",
                120: "@expand:flockquencer.sequence.newSequence()",
            }
        },
        selectors: {
            controlInput: ".control-input",
            controlOutput: ".control-output",
            uiOutput: ".ui-output"
        },
        invokers: {
            distributeModalEvent: {
                funcName: "flockquencer.router.distributeModalEvent",
                args:     ["{that}", "{arguments}.0", "{arguments}.1"] // event, payload
            }
        },
        distributeOptions: [
            // Distribute the control output (note player) to all modes.
            {
                record: "{flockquencer.router}.controlOutput",
                target: "{that flockquencer.mode}.options.components.controlOutput"
            },
            // Distribute the control output (note player) to the sequence player if it exists.
            {
                record: "{flockquencer.router}.controlOutput",
                target: "{that flockquencer.sequence.player}.options.components.controlOutput"
            },
            // Distribute the UI output (note painter) to all modes.
            {
                record: "{flockquencer.router}.uiOutput",
                target: "{that flockquencer.mode}.options.components.uiOutput"
            },
            // Distribute the control input to the onscreen UI.
            {
                record: "{flockquencer.router}.controlInput",
                target: "{that flockquencer.onscreen}.options.components.controlInput"
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
                                    raw: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["raw", "{arguments}.0"]
                                    },
                                    message: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["message", "{arguments}.0"]
                                    },
                                    note: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["note", "{arguments}.0"]
                                    },
                                    noteOn: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["noteOn", "{arguments}.0"]
                                    },
                                    noteOff: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["noteOff", "{arguments}.0"]
                                    },
                                    control: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["control", "{arguments}.0"]
                                    },
                                    program: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["program", "{arguments}.0"]
                                    },
                                    aftertouch: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["aftertouch", "{arguments}.0"]
                                    },
                                    pitchbend: {
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["pitchbend", "{arguments}.0"]
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
            uiOutput: {
                type: "flockquencer.connector",
                container: "{that}.dom.uiOutput",
                options: {
                    portType: "output",
                    listeners: {
                        raw: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiRaw", "{arguments}.0"]
                        },
                        message: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiMessage", "{arguments}.0"]
                        },
                        note: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiNote", "{arguments}.0"]
                        },
                        noteOn: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiNoteOn", "{arguments}.0"]
                        },
                        noteOff: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiNoteOff", "{arguments}.0"]
                        },
                        control: {
                            func: "{flockquencer.router}.distributeModalEvent",
                            args: ["uiControl", "{arguments}.0"]
                        }
                    },
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
                                        func: "{flockquencer.router}.distributeModalEvent",
                                        args: ["onUiOutputReady", "{arguments}.0"]
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
            },
            modeSelect: {
                type: "flockquencer.mode.ui",
                options: {
                    model: {
                        mode: "{flockquencer.router}.model.mode"
                    }
                }
            },
            performanceMode: {
                type: "flockquencer.mode.performance",
                options: {
                    model: {
                        mode: "{flockquencer.router}.model.mode",
                        octaveOffset: "{flockquencer.router}.model.octaveOffset",
                        performanceChannel: "{flockquencer.router}.model.octaveOffset",
                        sequences: "{flockquencer.router}.model.sequences"
                    }
                }
            }
        }
    });
})(fluid);

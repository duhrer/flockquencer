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
                }
            }
        }, { flat: true });
    };

    fluid.defaults("flockquencer.router", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            mode: "performance",
            octaveOffset: 0
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
            // Distribute the UI output (note painter) to all modes.
            {
                record: "{flockquencer.router}.controlOutput",
                target: "{that flockquencer.mode}.options.components.controlOutput"
            },
            // Distribute the note output (note player) to all modes.
            {
                record: "{flockquencer.router}.uiOutput",
                target: "{that flockquencer.mode}.options.components.uiOutput"
            },
            // Distribute the control input to the onscreen UI.
            {
                record: "{flockquencer.router}.controlInput",
                target: "{that flockquencer.onscreen}.options.components.controlInput"
            },
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
                type: "flock.ui.midiConnector",
                container: "{that}.dom.controlOutput",
                options: {
                    portType: "output"
                }
            },
            uiOutput: {
                type: "flock.ui.midiConnector",
                container: "{that}.dom.uiOutput",
                options: {
                    portType: "output",
                    components: {
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
                container: ".flockquencer-onscreen",
                options: {
                    model: {
                        octaveOffset: "{flockquencer.router}.model.octaveOffset",
                        performanceChannel: "{flockquencer.router}.model.octaveOffset"
                    }
                }
            },
            performanceMode: {
                type: "flockquencer.mode.performance",
                options: {
                    model: {
                        octaveOffset: "{flockquencer.router}.model.octaveOffset",
                        performanceChannel: "{flockquencer.router}.model.octaveOffset"
                    }
                }
            }
        }
    })
})(fluid);
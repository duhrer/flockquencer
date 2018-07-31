(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");
    fluid.registerNamespace("flockquencer.demo.sequencePlayer");

    flockquencer.demo.sequencePlayer.setAllSequenceStatuses = function (that, status) {
        var sequences = flockquencer.sequence.player.getSequences(that);
        fluid.each(sequences, function (sequence){
            sequence.status = status;
        });
    };

    flockquencer.demo.sequencePlayer.updateBpm = function (that, event) {
        event.preventDefault();
        var bpmElement = that.locate("bpmInput");
        that.applier.change("bpm", parseInt($(bpmElement).val(), 10));
    };

    fluid.defaults("flockquencer.demo.sequencePlayer", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            bpm: 120
        },
        selectors: {
            controlOutput: ".control-output",
            startButton:   ".start-button",
            stopButton:    ".stop-button",
            bpmInput:      ".bpm"
        },
        distributeOptions: [
            // Distribute the control output (note player) to the sequencer player.
            {
                record: "{flockquencer.demo.sequencePlayer}.controlOutput",
                target: "{that flockquencer.sequence.player}.options.components.controlOutput"
            }
        ],
        components: {
            enviro: {
                type: "flock.enviro"
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
                        },
                        connection: {
                            options: {
                                listeners: {
                                    "onReady.startClock": {
                                        func: "{sequencerPlayer}.start"
                                    }
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
                        bpm: "{flockquencer.demo.sequencePlayer}.model.bpm"
                    }
                }
            }
        },
        listeners: {
            "onCreate.bindStart": {
                "this": "{that}.dom.startButton",
                "method": "click",
                "args": ["{that}.startSequences"]
            },
            "onCreate.bindStop": {
                "this": "{that}.dom.stopButton",
                "method": "click",
                "args": ["{that}.stopSequences"]
            },
            "onCreate.bindBpm": {
                "this": "{that}.dom.bpmInput",
                "method": "change",
                "args": ["{that}.updateBpm"]
    }
        },
        invokers: {
            "startSequences": {
                funcName: "flockquencer.demo.sequencePlayer.setAllSequenceStatuses",
                args:     ["{sequencerPlayer}", flockquencer.sequence.status.STARTING]
            },
            "stopSequences": {
                funcName: "flockquencer.demo.sequencePlayer.setAllSequenceStatuses",
                args:     ["{sequencerPlayer}", flockquencer.sequence.status.STOPPING]
            },
            "updateBpm": {
                funcName: "flockquencer.demo.sequencePlayer.updateBpm",
                args:     ["{that}", "{arguments}.0"] // event
            }
        }
    });
})(fluid);

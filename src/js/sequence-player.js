(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.sequence.player");

    flockquencer.sequence.player.refresh = function (that) {
        that.stop();

        that.scheduler.clearAll();

        that.scheduler.schedule({
            type: "repeat",
            freq: that.model.bpm / 60,
            callback: that.processStep
        });

        that.start();
    };

    flockquencer.sequence.player.start = function (that) {
        that.scheduler.start();
    };

    flockquencer.sequence.player.stop = function (that) {
        flockquencer.sequence.player.stopScheduler(that);
    };

    flockquencer.sequence.player.stopScheduler = function (that) {
        // Make sure any lingering arpeggiations don't start playing if we start up later.
        that.stopAllArpeggiations();

        // TODO: we may need to ensure that one last beat is fired to cleanup or otherwise silence any playing notes.
        that.scheduler.stop();
    };

    flockquencer.sequence.player.processStep = function (that) {
        fluid.each(that.model.sequences, that.handleStepForSequence);

        // Process arpeggiations.
        fluid.each(that.arpeggiations, that.handleStepForArpeggiation);

        // Update the beat for the next round.
        that.applier.change("beat", that.model.beat + 1);
    };

    flockquencer.sequence.player.handleStepForSequence = function (that, sequence, isArpeggiation) {
        if (sequence.status !== flockquencer.sequence.status.STOPPED) {

            // Promote any notes waiting to play if the timing is right, i.e. if the current beat is divisible by their length.
            if (sequence.status === flockquencer.sequence.status.STARTING) {
                if (isArpeggiation) {
                    sequence.stepOffset = that.model.beat % sequence.length;
                    sequence.status = flockquencer.sequence.status.PLAYING;
                }
                else if (that.model.beat % sequence.length === 0) {
                    sequence.status = flockquencer.sequence.status.PLAYING;
                }
            }

            if (sequence.status === flockquencer.sequence.status.PLAYING || sequence.status === flockquencer.sequence.status.STOPPING) {
                var stepOffset = sequence.stepOffset || 0;
                var sequenceOffset = (that.model.beat - stepOffset) % sequence.length;

                // Get the current step.
                var currentStep = fluid.get(sequence.steps, sequenceOffset);

                // Get the previous step
                var previousOffset = sequenceOffset === 0 ? sequence.length - 1: sequenceOffset - 1;
                var previousStep = fluid.get(sequence.steps, previousOffset);

                var notesToStop = fluid.get(previousStep, "notes") || [];
                var notesToStart = fluid.get(currentStep, "notes") || [];

                if (currentStep && currentStep.tied && sequence.status !== flockquencer.sequence.status.STOPPING) {
                    var stepComparison = flockquencer.sequence.player.compareSteps(previousStep.notes, currentStep.notes);

                    // Stop any notes that are only part of the old pattern.
                    notesToStop = stepComparison.left;

                    // Start any notes that are only part of the new pattern.
                    notesToStart = stepComparison.right;
                }

                // Relative pitch offset for notes that are part of an arpeggiation.
                var noteOffset = sequence.noteOffset || 0;

                // Stop all the old notes
                fluid.each(notesToStop, function (note) {
                    var noteAsInt = parseInt(note, 10);
                    that.controlOutput.send({
                        type: "noteOff",
                        note: noteAsInt + noteOffset,
                        velocity: 0
                    });
                });

                // start all the new notes.
                if (sequence.status === flockquencer.sequence.status.PLAYING) {
                    // Start all the notes.
                    fluid.each(notesToStart, function (note) {
                        var noteAsInt = parseInt(note, 10);
                        that.controlOutput.send({
                            type: "noteOn",
                            note: noteAsInt + noteOffset,
                            velocity: 100 // TODO: Make this controllable somehow.
                        });
                    });
                }

                // Now that we've had a chance to silence any last notes, flag a "stopping" sequence as "stopped".
                if (sequence.status === flockquencer.sequence.status.STOPPING) {
                    sequence.status = flockquencer.sequence.status.STOPPED;
                }
            }
        }
    };

    /**
     *
     * Compare two arrays and indicate which entries are only found in the left array, with are only found in the right,
     * and which are common to both.
     *
     * @param {Array<Number>} leftArray - An array of numbers (in this case pitches).
     * @param {Array<Number>} rightArray - An array of numbers to compare to `leftArray`.
     * @return {Object} - An object that contains the original values sorted into left, right, and common arrays.
     *
     */
    flockquencer.sequence.player.compareSteps = function (leftArray, rightArray) {
        leftArray.sort(); rightArray.sort();
        var results = { left: [], right: [], common: [] };
        var combinator = {};

        for (var a = 0; a < leftArray.length; a++) {
            combinator[leftArray[a]] = "l";
        }
        for (var b = 0; b < rightArray.length; b++) {
            if (combinator[rightArray[b]]) {
                combinator[rightArray[b]] = "c";
            }
            else {
                combinator[rightArray[b]] = "r";
            }
        }

        fluid.each(combinator, function (state, value) {
            if (state === "c") {
                results.common.push(value);
            }
            else if (state === "l") {
                results.left.push(value);
            }
            else if (state === "r") {
                results.right.push(value);
            }
        });

        return results;
    };

    flockquencer.sequence.player.stopAllArpeggiations = function (that) {
        fluid.each(that.arpeggiations, function (sequence) {
            sequence.status = flockquencer.sequence.status.STOPPING;
        });
    };

    fluid.defaults("flockquencer.sequence.player", {
        gradeNames: ["fluid.modelComponent"],
        defaultNote: 63,
        members: {
            arpeggiations: {}
        },
        model: {
            bpm: 120,
            beat: 0,
            sequences: {}
        },
        invokers: {
            start: {
                funcName: "flockquencer.sequence.player.start",
                args:     ["{that}"]
            },
            stop: {
                funcName: "flockquencer.sequence.player.stop",
                args:     ["{that}"]
            },
            stopAllArpeggiations: {
                funcName: "flockquencer.sequence.player.stopAllArpeggiations",
                args:     ["{that}"]
            },
            processStep: {
                funcName: "flockquencer.sequence.player.processStep",
                args:     ["{that}"]
            },
            handleStepForArpeggiation: {
                funcName: "flockquencer.sequence.player.handleStepForSequence",
                args:     ["{that}", "{arguments}.0", true]

            },
            handleStepForSequence: {
                funcName: "flockquencer.sequence.player.handleStepForSequence",
                args:     ["{that}", "{arguments}.0"]

            },
            refresh: {
                funcName: "flockquencer.sequence.player.refresh",
                args:     ["{that}"]
            }

        },
        components: {
            scheduler: {
                type: "berg.scheduler",
                options: {
                    components: {
                        clock: {
                            type: "berg.clock.raf",
                            options: {
                                //freq: 17 // Times per second, enough to poll for 999 bpm / 60 seconds.
                                freq: 50 // times per second, enough to handle 3000 bpm / 60 seconds.
                            }
                            //// TODO: pair with Colin and get this working
                            //type: "berg.clock.autoAudioContext"
                        }
                    }
                }
            }
        },
        modelListeners: {
            bpm: {
                func: "{that}.refresh",
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.init": {
                func: "{that}.refresh"
            }
        }

    });

})(fluid);

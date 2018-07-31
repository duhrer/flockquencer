(function (fluid){
    // TODO:  Once we get this working with a simple timing effort, add support for transmitting notes.
    fluid.defaults("flockquencer", {
        gradeNames: ["fluid.modelComponent"], // This will eventually be updatable in real time.
        model: {
            bpm: 120,
            sequences: {
                // Once every beat, i.e. twice a second.
                everyBeat: {
                    length: 1,
                    steps: [{ beat: 0, note: "every", duration: 1}]
                },
                // Once every other beat, i.e. once a second.
                everyOtherBeat: {
                    length: 4,
                    steps: [{ beat: 0, note: "every other", duration: 1}, { beat: 2, note: "every other", duration: 1}]
                },
                // every fourth beat:
                everyFourth: {
                    length: 4,
                    steps: [{ beat: 0, note: "every fourth", duration: 1}]
                }
            }
        },
        invokers: {
            start: {
                funcName: "flockquencer.start",
                args: ["{that}"]
            },
            stop: {
                funcName: "flockquencer.stop",
                args: ["{that}"]
            },
            refresh: {
                funcName: "flockquencer.refresh",
                args:     ["{that}"]
            }
        },
        members: {
            isPlaying :false
        },
        modelListeners: {
            sequences: {
                func: "{that}.refresh",
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.refresh": {
                func: "{that}.refresh"
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
                                freq: 2 // Times per second.
                            }
                        }
                    }
                }
            }
        }
    });

    flockquencer.refresh = function (that) {
        that.stop();

        that.scheduler.clearAll();

        /*
        sequences: {
                everyOther: {
                    length: 4,
                    steps: [{ beat: 0, note: "C4", duration: 1}, { beat: 2, note: "C4", duration: 1}]
                },
                every: {
                    length: 1,
                    steps: [{ beat: 0, note: "C5", duration: 1}]
                }
            }
         */
        var bpmFreq = that.model.bpm / 60; // beats per second.
        var secondsPerBeat = 1 / bpmFreq;
        fluid.each(that.model.sequences, function (sequence){
            var seqFreq = bpmFreq / sequence.length; // each note should happen 1/nth of the overall frequency.
            fluid.each(sequence.steps, function (step){
                // for example 2 beats per second for a 4-beat sequence means each beat should start a half second later:
                // 0: 0ms, 1: 0.5ms, 2: 1.0ms, 3: 1.5ms
                var stepOnTime = (step.beat * secondsPerBeat);
                var stepOffTime = stepOnTime + (step.duration * secondsPerBeat);
                /*

                    that.scheduler.schedule({
                        type: "repeat",
                        time: 2,
                        freq: 0.5, // 1 over the number of seconds?  Seems like it.
                        end: 20,
                        callback: function (now) {
                            console.log(now);
                        }
                    });

                */
                that.scheduler.schedule({
                    type: "repeat",
                    //type: "once",
                    length: sequence.length,
                    time: stepOnTime, // when it'll start relative to "now", in seconds.
                    freq: 1/sequence.length,
                    //freq: seqFreq, // times it'll happen per second.
                    callback: function (now) {
                        console.log(now, step.beat, step.note, stepOnTime, seqFreq);
                    }
                });
                //that.scheduler.schedule({
                //    //type: "once",
                //    type: "repeat",
                //    time: stepOffTime,
                //    freq: sequenceFreq,
                //    callback: function (now) {
                //        console.log(now, step.note, "OFF");
                //    }
                //});
            });
        });
    };

    flockquencer.start = function (that) {
        that.scheduler.start();
        that.scheduler.clock.start();
    };

    flockquencer.stop = function (that) {
        // TODO: Figure out why we have to stop this twice.
        that.scheduler.clock.stop();
        that.scheduler.stop();
    };
})(fluid);

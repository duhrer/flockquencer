(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.mode.ui");


    flockquencer.mode.ui.handleControl = function (that, controlPayload) {
        var modeToSet = fluid.get(that, ["options", "modes", controlPayload.number]);
        if (modeToSet) {
            that.applier.change("mode", modeToSet);
        }
    };

    flockquencer.mode.ui.handleModeChange = function (that) {
        fluid.each(that.options.modes, function (modeName, modeNumber) {
            var value = that.model.mode === modeName ? 127 : 0;
            that.uiOutput.send({type: "control", channel: 0, number: modeNumber, value: value});
        });
    };

    fluid.defaults("flockquencer.mode.ui", {
        gradeNames: ["flockquencer.mode"],
        mode: "*",
        model: {
            mode: "performance"
        },
        modes: {
            108: "performance",
            109: "step-edit",
            110: "step-note",
            111: "channel-select"
        },
        listeners: {
            control: {
                funcName: "flockquencer.mode.ui.handleControl",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        modelListeners: {
            mode: {
                excludeSource: "init",
                funcName: "flockquencer.mode.ui.handleModeChange",
                args:     ["{that}"]
            }
        }
    })
})(fluid);

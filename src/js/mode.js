(function (fluid) {
    "use strict";
    fluid.defaults("flockquencer.mode", {
        gradeNames: ["fluid.modelComponent"],
        events: {
            // MIDI note events.
            raw: null,
            message: null,
            note: null,
            noteOn: null,
            noteOff: null,
            control: null,
            program: null,
            aftertouch: null,
            pitchbend: null,
            // uiOutput Connection event
            onUiOutputReady: null
        }
    })
})(fluid);

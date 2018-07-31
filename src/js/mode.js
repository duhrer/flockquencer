(function (fluid) {
    "use strict";
    fluid.defaults("flockquencer.mode", {
        gradeNames: ["fluid.modelComponent"],
        events: {
            // MIDI input events.
            raw: null,
            message: null,
            note: null,
            noteOn: null,
            noteOff: null,
            control: null,
            program: null,
            aftertouch: null,
            pitchbend: null,

            // UI output events
            "uiRaw": null,
            "uiMessage": null,
            "uiNote": null,
            "uiNoteOn": null,
            "uiNoteOff": null,
            "uiControl": null,

            // uiOutput Connection event
            onUiOutputReady: null
        }
    })
})(fluid);

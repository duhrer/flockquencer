(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.onscreen");

    flockquencer.onscreen.paintItem = function (that, type, index, colour) {
        var selector = type + index;
        var element = that.locate(selector);
        if (element) {
            element.css("fill", colour);
        }
    };

    // TODO: Needs to listen to UI output as well as control input notes.
    flockquencer.onscreen.handleNote = function (that, midiMessage) {
        if (!fluid.get(that, ["options", "controlNotes", midiMessage.note])) {
            // On a NoteOff event, send a noteOn to the note in question with the right colour (velocity).
            if (midiMessage.type === "noteOff" || midiMessage.velocity === 0) {
                that.paintItem("note", midiMessage.note, "#aeaeae");
            }
            // On a NoteOn event, send a noteOn to the note in question with a velocity of 12 (off).
            else {
                var htmlColour = flockquencer.colours.htmlByVelocity[midiMessage.velocity & 51] || 0; // bitwise AND with 0b0110011
                that.paintItem("note", midiMessage.note, htmlColour);
            }
        }
    };

    flockquencer.onscreen.handleControl = function (that, midiMessage) {
        // Respond to "all notes off" and "device reset" messages so that notes locked in the onscreen UI are no longer displayed when the octave changes.
        if (midiMessage.number === 123 || midiMessage.number === 0) {
            var allElements = that.locate("note");
            allElements.css("fill", flockquencer.colours.htmlByVelocity[0]);
        }
        else {
            var colour = fluid.get(flockquencer.colours.htmlByVelocity, midiMessage.value & 51) || "#aeaeae"; // bitwise AND with 0b0110011
            that.paintItem("cc", midiMessage.number, colour);
        }
    };

    flockquencer.onscreen.extractNote = function (string) {
        return parseInt(flockquencer.onscreen.extractPattern(string, "note"), 10);
    };

    flockquencer.onscreen.extractControlNumber = function (string) {
        return parseInt(flockquencer.onscreen.extractPattern(string, "cc"), 10);
    };

    flockquencer.onscreen.extractPattern = function (string, objectType) {
        var segments = string.split(" ");
        var matchingPattern = fluid.find(segments, function (segment) {
            var matches = segment.match(new RegExp("launchpad-" + objectType + "-(.+)"));
            return matches ? matches[1] : undefined;
        });
        return matchingPattern;
    };

    flockquencer.onscreen.handleMouseEvent = function (that, buttonType, mouseEventType, event) {
        event.preventDefault();

        if (buttonType === "note") {
            var note = flockquencer.onscreen.extractNote(event.target.getAttribute("class"));

            var noteOptions = {
                type:     mouseEventType === "down" ? "noteOn" : "noteOff",
                note:     note,
                velocity: mouseEventType === "down" ? 127 : 0
            };

            that.events.note.fire(noteOptions);

            var controlInput = fluid.get(that, "controlInput");
            if (controlInput) {
                controlInput.events.note.fire(noteOptions);
            }
        }
        else if (buttonType === "cc") {
            var ccNumber = flockquencer.onscreen.extractControlNumber(event.target.getAttribute("class"));

            var noteOptions = {
                type:     "control",
                number:   ccNumber,
                value:    mouseEventType === "down" ? 127 : 0
            };

            that.events.control.fire(noteOptions);

            var controlInput = fluid.get(that, "controlInput");
            if (controlInput) {
                controlInput.events.control.fire(noteOptions);
            }
        }
    };

    flockquencer.onscreen.renderSvg = function (that) {
        that.container.html(flockquencer.onscreen.svg);
        that.events.onSvgRendered.fire();
    };

    fluid.defaults("flockquencer.onscreen", {
        gradeNames: ["flockquencer.mode", "fluid.viewComponent"],
        mode: "*",
        maxOctaveOffset: 2,
        minOctaveOffset: -2,
        events: {
            onSvgRendered: null
        },
        model: {
            displayBuffer:      0,
            writeBuffer:        0
        },
        //controlNotes: {
        //    8: true, 24: true, 40: true, 56: true, 72: true, 88: true, 104: true, 120: true
        //},
        selectors: {
            buffer0: ".launchpad-buffer-0",
            buffer1: ".launchpad-buffer-1",
            cc104:   ".launchpad-cc-104",
            cc105:   ".launchpad-cc-105",
            cc106:   ".launchpad-cc-106",
            cc107:   ".launchpad-cc-107",
            cc108:   ".launchpad-cc-108",
            cc109:   ".launchpad-cc-109",
            cc110:   ".launchpad-cc-110",
            cc111:   ".launchpad-cc-111",
            control: ".launchpad-control",
            frame:   "#launchpad-frame",
            note:    ".launchpad-note",
            note0:   ".launchpad-note-0",
            note1:   ".launchpad-note-1",
            note2:   ".launchpad-note-2",
            note3:   ".launchpad-note-3",
            note4:   ".launchpad-note-4",
            note5:   ".launchpad-note-5",
            note6:   ".launchpad-note-6",
            note7:   ".launchpad-note-7",
            note8:   ".launchpad-note-8",
            note16:  ".launchpad-note-16",
            note17:  ".launchpad-note-17",
            note18:  ".launchpad-note-18",
            note19:  ".launchpad-note-19",
            note20:  ".launchpad-note-20",
            note21:  ".launchpad-note-21",
            note22:  ".launchpad-note-22",
            note23:  ".launchpad-note-23",
            note24:  ".launchpad-note-24",
            note32:  ".launchpad-note-32",
            note33:  ".launchpad-note-33",
            note34:  ".launchpad-note-34",
            note35:  ".launchpad-note-35",
            note36:  ".launchpad-note-36",
            note37:  ".launchpad-note-37",
            note38:  ".launchpad-note-38",
            note39:  ".launchpad-note-39",
            note40:  ".launchpad-note-40",
            note48:  ".launchpad-note-48",
            note49:  ".launchpad-note-49",
            note50:  ".launchpad-note-50",
            note51:  ".launchpad-note-51",
            note52:  ".launchpad-note-52",
            note53:  ".launchpad-note-53",
            note54:  ".launchpad-note-54",
            note55:  ".launchpad-note-55",
            note56:  ".launchpad-note-56",
            note64:  ".launchpad-note-64",
            note65:  ".launchpad-note-65",
            note66:  ".launchpad-note-66",
            note67:  ".launchpad-note-67",
            note68:  ".launchpad-note-68",
            note69:  ".launchpad-note-69",
            note70:  ".launchpad-note-70",
            note71:  ".launchpad-note-71",
            note72:  ".launchpad-note-72",
            note80:  ".launchpad-note-80",
            note81:  ".launchpad-note-81",
            note82:  ".launchpad-note-82",
            note83:  ".launchpad-note-83",
            note84:  ".launchpad-note-84",
            note85:  ".launchpad-note-85",
            note86:  ".launchpad-note-86",
            note87:  ".launchpad-note-87",
            note88:  ".launchpad-note-88",
            note96:  ".launchpad-note-96",
            note97:  ".launchpad-note-97",
            note98:  ".launchpad-note-98",
            note99:  ".launchpad-note-99",
            note100: ".launchpad-note-100",
            note101: ".launchpad-note-101",
            note102: ".launchpad-note-102",
            note103: ".launchpad-note-103",
            note104: ".launchpad-note-104",
            note112: ".launchpad-note-112",
            note113: ".launchpad-note-113",
            note114: ".launchpad-note-114",
            note115: ".launchpad-note-115",
            note116: ".launchpad-note-116",
            note117: ".launchpad-note-117",
            note118: ".launchpad-note-118",
            note119: ".launchpad-note-119",
            note120: ".launchpad-note-120"
        },
        invokers: {
            "handleControlMouseDown": {
                funcName: "flockquencer.onscreen.handleMouseEvent",
                args:     ["{that}", "cc", "down", "{arguments}.0"]
            },
            "handleNoteMouseDown": {
                funcName: "flockquencer.onscreen.handleMouseEvent",
                args:     ["{that}", "note", "down", "{arguments}.0"]
            },
            "handleNoteMouseUp": {
                funcName: "flockquencer.onscreen.handleMouseEvent",
                args:     ["{that}", "note", "up", "{arguments}.0"]
            },
            "paintItem": {
                funcName: "flockquencer.onscreen.paintItem",
                args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // type, index, colour
            }
        },
        listeners: {
            "onCreate.renderSvg": {
                funcName: "flockquencer.onscreen.renderSvg",
                args: ["{that}"]
            },
            "onSvgRendered.bindNoteMouseDown": {
                "this": "{that}.dom.note",
                "method": "mousedown",
                "args": ["{that}.handleNoteMouseDown"]
            },
            "onSvgRendered.bindNoteMouseUp": {
                "this": "{that}.dom.note",
                "method": "mouseup",
                "args": ["{that}.handleNoteMouseUp"]
            },
            "onSvgRendered.bindControlMouseDown": {
                "this": "{that}.dom.control",
                "method": "mousedown",
                "args": ["{that}.handleControlMouseDown"]
            },
            "uiNote.handleNote": {
                funcName: "flockquencer.onscreen.handleNote",
                args:     ["{that}",  "{arguments}.0"] // midiMessage
            },
            "uiControl.handleControl": {
                funcName: "flockquencer.onscreen.handleControl",
                args:     ["{that}",  "{arguments}.0"] // midiMessage
            }
        }
    });
})(fluid);

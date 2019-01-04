/*

    A "tap" connector that acts as a proxy for its underlying connection and which issues note, control, etc. events
    as messages are sent out.  Allows other services to listen for outgoing messages, for example to a Launchpad.

 */
(function (fluid) {
    var flockquencer = fluid.registerNamespace("flockquencer");

    fluid.registerNamespace("flockquencer.connector");

    flockquencer.connector.send = function (that, midiMessage) {
        if (that.connection) {
            that.connection.send(midiMessage);
        }

        var messageType = fluid.get(midiMessage, "type");

        if (messageType === "note" || messageType === "control" || messageType === "noteOn" || messageType === "noteOff") {
            that.events[messageType].fire(midiMessage);
        }
        if (messageType === "noteOn" || messageType === "noteOff") {
            that.events.note.fire(midiMessage);
        }
    };

    fluid.defaults("flockquencer.connector", {
        gradeNames: ["flock.auto.ui.midiConnector"],
        portType: "output",
        preferredDevice: "Launchpad",
        distributeOptions: {
            source: "{that}.options.preferredDevice",
            target: "{that flock.auto.ui.selectBox}.options.preferredDevice"
        },
        events: {
            note: null,
            noteOn: null,
            noteOff: null,
            control: null
        },
        invokers: {
            send: {
                funcName: "flockquencer.connector.send",
                args:     ["{that}", "{arguments}.0"]
            }
        }
    })

})(fluid);

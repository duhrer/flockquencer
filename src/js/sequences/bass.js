(function (fluid) {
    var flockquencer = fluid.registerNamespace("flockquencer");
    fluid.registerNamespace("flockquencer.sequences.bass");

    flockquencer.sequences.bass.a = {
        length: 8,
        steps: {
            0: {
                notes: [40]
            },
            1: {
                notes: [44]
            },
            2: {
                notes: [47]
            },
            3: {
                notes: [49]
            },
            4: {
                notes: [50]
            },
            5: {
                notes: [49]
            },
            6: {
                notes: [47]
            },
            7: {
                notes: [44]
            }
        }
    };

    flockquencer.sequences.bass.b = {
        length: 14,
        steps: {
            0: {
                notes: [28]
            },
            2: {
                notes: [28]
            },
            3: {
                notes: [28]
            },
            4: {
                notes: [28]
            },
            6: {
                notes: [28]
            },
            7: {
                notes: [28]
            },
            8: {
                notes: [28]
            },
            10: {
                notes: [28]
            },
            11: {
                notes: [28]
            },
            12: {
                notes: [28]
            }
        }
    };
})(fluid);

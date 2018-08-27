(function (fluid) {
    var flockquencer = fluid.registerNamespace("flockquencer");
    fluid.registerNamespace("flockquencer.sequences.guitar");

    // Major chord plus octave, in the style of a guitar
    flockquencer.sequences.guitar.major = {
        length: 12,
        steps: {
            0: {
                notes: [50]
            },
            1: {
                tied: true,
                notes: [50, 57]
            },
            2: {
                tied: true,
                notes: [50, 57, 62]
            },
            3: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            4: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            5: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            6: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            7: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            8: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            9: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            10: {
                tied: true,
                notes: [50, 57, 62, 66]
            },
            11: {
                tied: true,
                notes: [50, 57, 62, 66]
            }
        }
    };

    // Minor chord plus octave, in the style of a guitar
    flockquencer.sequences.guitar.minor = {
        length: 12,
        steps: {
            0: {
                notes: [50]
            },
            1: {
                tied: true,
                notes: [50, 57]
            },
            2: {
                tied: true,
                notes: [50, 57, 62]
            },
            3: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            4: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            5: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            6: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            7: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            8: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            9: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            10: {
                tied: true,
                notes: [50, 57, 62, 65]
            },
            11: {
                tied: true,
                notes: [50, 57, 62, 65]
            }
        }
    };

    // Major 7th chord.
    flockquencer.sequences.guitar.major7 = {
        length: 12,
        steps: {
            0: {
                notes: [50]
            },
            1: {
                tied: true,
                notes: [50, 54]
            },
            2: {
                tied: true,
                notes: [50, 54, 57]
            },
            3: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            4: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            5: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            6: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            7: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            8: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            9: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            10: {
                tied: true,
                notes: [50, 54, 57, 62]
            },
            11: {
                tied: true,
                notes: [50, 54, 57, 62]
            }
        }
    };

    // Minor 7th chord.
    flockquencer.sequences.guitar.minor7 = {
        length: 12,
        steps: {
            0: {
                notes: [50]
            },
            1: {
                tied: true,
                notes: [50, 53]
            },
            2: {
                tied: true,
                notes: [50, 53, 57]
            },
            3: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            4: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            5: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            6: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            7: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            8: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            9: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            10: {
                tied: true,
                notes: [50, 53, 57, 62]
            },
            11: {
                tied: true,
                notes: [50, 53, 57, 62]
            }
        }
    };
})(fluid);

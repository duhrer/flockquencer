(function (fluid) {
    var flockquencer = fluid.registerNamespace("flockquencer");
    fluid.registerNamespace("flockquencer.sequences");

    // S-O-S in morse:
    // S: 1 on, 1 off, 1 on, 1 off, 1 on                      =  5 beats
    // three beats pause between letter                       =  3 beats
    // O: 3 on (tied), 1 off, 3 on (tied), 1 off, 3 on (tied) = 11 beats
    // three beats pause between letter                       =  3 beats
    // S: 1 on, 1 off, 1 on, 1 off, 1 on                      =  5 beats
    // seven beats pause before reset                         =  7 beats
    //                                                        = 34 beats total
    flockquencer.sequences.morse = {
        length: 34,
        steps: {
            0: {
                notes: [96]
            },
            2: {
                notes: [96]
            },
            4: {
                notes: [96]
            },
            8: {
                notes: [96]
            },
            9: {
                tied: true,
                notes: [96]
            },
            10: {
                tied: true,
                notes: [96]
            },
            12: {
                notes: [96]
            },
            13: {
                tied: true,
                notes: [96]
            },
            14: {
                tied: true,
                notes: [96]
            },
            16: {
                notes: [96]
            },
            17: {
                tied: true,
                notes: [96]
            },
            18: {
                tied: true,
                notes: [96]
            },
            22: {
                notes: [96]
            },
            24: {
                notes: [96]
            },
            26: {
                notes: [96]
            }
        }
    }
})(fluid);

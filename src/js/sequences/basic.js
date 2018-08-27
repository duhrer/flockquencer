(function (fluid) {
    "use strict";
    var flockquencer = fluid.registerNamespace("flockquencer");
    fluid.registerNamespace("flockquencer.sequences.every");

    flockquencer.sequences.every.one = {
        length: 1,
        steps: {
            0: {
                notes: [88]
            }
        }
    };

    flockquencer.sequences.every.two= {
        length: 2,
        steps: {
            1: {
                notes: [76]
            }
        }
    };

    flockquencer.sequences.every.three= {
    length: 3,
        steps: {
            2: {
                notes: [64]
            }
        }
    };

    flockquencer.sequences.every.four= {
        length: 4,
        steps: {
            3: {
                notes: [52]
            }
        }
    };
})(fluid);

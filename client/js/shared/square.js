System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Square;
    return {
        setters: [],
        execute: function () {
            Square = class Square {
                constructor(position, bounds) {
                    this.position = position;
                    this.bounds = bounds;
                    this.enabled = true;
                    this.color = null;
                }
                get empty() { return this.color === null; }
            };
            exports_1("default", Square);
        }
    };
});

//# sourceMappingURL=square.js.map

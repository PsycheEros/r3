System.register(["./canvas"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var canvas_1, Canvas2D;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            Canvas2D = class Canvas2D extends canvas_1.default {
                constructor(canvas) {
                    super(canvas);
                    this.c2d = canvas.getContext('2d');
                }
                clear() {
                    const { c2d, width, height } = this;
                    c2d.clearRect(0, 0, width, height);
                }
            };
            exports_1("default", Canvas2D);
        }
    };
});

//# sourceMappingURL=canvas2d.js.map

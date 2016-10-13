System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Canvas;
    return {
        setters: [],
        execute: function () {
            Canvas = class Canvas {
                constructor(canvas) {
                    this.canvas = canvas;
                }
                get width() {
                    const { canvas } = this;
                    return canvas.width;
                }
                set width(value) {
                    const { canvas } = this;
                    canvas.width = value;
                }
                get height() {
                    const { canvas } = this;
                    return canvas.height;
                }
                set height(value) {
                    const { canvas } = this;
                    canvas.height = value;
                }
                screenToCanvas({ x, y }) {
                    const { canvas, width, height } = this, rect = canvas.getBoundingClientRect();
                    return { x: (x - rect.left) * (width / rect.width), y: (y - rect.top) * (height / rect.height) };
                }
                canvasToScreen({ x, y }) {
                    const { canvas, width, height } = this, rect = canvas.getBoundingClientRect();
                    return { x: (x * (rect.width / width)) + rect.left, y: (y * (rect.height / height)) + rect.top };
                }
            };
            exports_1("default", Canvas);
        }
    };
});

//# sourceMappingURL=canvas.js.map

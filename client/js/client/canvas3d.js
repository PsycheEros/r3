System.register(["./canvas"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var canvas_1, Canvas3D;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            Canvas3D = class Canvas3D extends canvas_1.default {
                constructor(canvas) {
                    super(canvas);
                    this.gl = canvas.getContext('webgl');
                }
                clear() {
                    const { gl } = this;
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                }
            };
            exports_1("default", Canvas3D);
        }
    };
});

//# sourceMappingURL=canvas3d.js.map

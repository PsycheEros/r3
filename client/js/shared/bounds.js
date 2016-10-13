System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Bounds;
    return {
        setters: [],
        execute: function () {
            Bounds = class Bounds {
                constructor(left, top, width, height) {
                    this.left = left;
                    this.top = top;
                    this.width = width;
                    this.height = height;
                }
                get bottom() {
                    const { top, height } = this;
                    return top + height;
                }
                get right() {
                    const { left, width } = this;
                    return left + width;
                }
                get center() {
                    const { left, top, width, height } = this, x = left + width * .5, y = top + height * .5;
                    return { x, y };
                }
                get n() {
                    const { left, top, width } = this, x = left + width * .5, y = top;
                    return { x, y };
                }
                get ne() {
                    const { left, top, width } = this, x = left + width, y = top;
                    return { x, y };
                }
                get e() {
                    const { left, top, width, height } = this, x = left + width, y = top + height * .5;
                    return { x, y };
                }
                get se() {
                    const { left, top, width, height } = this, x = left + width, y = top + height;
                    return { x, y };
                }
                get s() {
                    const { left, top, width, height } = this, x = left + width * .5, y = top + height;
                    return { x, y };
                }
                get sw() {
                    const { left, top, height } = this, x = left, y = top + height;
                    return { x, y };
                }
                get w() {
                    const { left, top, height } = this, x = left, y = top + height * .5;
                    return { x, y };
                }
                get nw() {
                    const { left, top } = this, x = left, y = top;
                    return { x, y };
                }
                hitTest({ x, y }) {
                    const { top, right, bottom, left } = this;
                    return x >= left && x <= right
                        && y >= top && y <= bottom;
                }
            };
            exports_1("default", Bounds);
        }
    };
});

//# sourceMappingURL=bounds.js.map

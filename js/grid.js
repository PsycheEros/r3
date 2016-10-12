System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function validate(grid, { x, y }) {
        if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
            throw new Error(`(${x}, ${y}) is not valid`);
        }
        if (!grid.boundsCheck({ x, y })) {
            throw new Error(`(${x}, ${y}) is out of bounds`);
        }
    }
    var Grid;
    return {
        setters: [],
        execute: function () {
            Grid = class Grid {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                    this.data = new Map();
                }
                boundsCheck({ x, y }) {
                    const { width, height } = this;
                    return x >= 0 && x < width && y >= 0 && y < height;
                }
                get({ x, y }) {
                    validate(this, { x, y });
                    const key = JSON.stringify({ x, y });
                    return this.data.get(key);
                }
                set({ x, y }, value) {
                    validate(this, { x, y });
                    const key = JSON.stringify({ x, y });
                    this.data.set(key, value);
                }
                [Symbol.iterator]() {
                    function* iterator() {
                        const { width, height } = this;
                        for (let x = 0; x < width; ++x)
                            for (let y = 0; y < height; ++y) {
                                yield this.get({ x, y });
                            }
                    }
                    return iterator.call(this);
                }
            };
            exports_1("default", Grid);
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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bnQiOlsiZnVuY3Rpb24gdmFsaWRhdGU8VD4oIGdyaWQ6IEdyaWQ8VD4sIHsgeCwgeSB9OiBQb2ludCApIHtcclxuXHRpZiggIU51bWJlci5pc1NhZmVJbnRlZ2VyKCB4ICkgfHwgIU51bWJlci5pc1NhZmVJbnRlZ2VyKCB5ICkgKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGAoJHt4fSwgJHt5fSkgaXMgbm90IHZhbGlkYCApO1xyXG5cdH1cclxuXHRpZiggIWdyaWQuYm91bmRzQ2hlY2soIHsgeCwgeSB9ICkgKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGAoJHt4fSwgJHt5fSkgaXMgb3V0IG9mIGJvdW5kc2AgKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQ8VD4ge1xyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvciggcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlciApIHt9XHJcblxyXG5cdHB1YmxpYyBib3VuZHNDaGVjayggeyB4LCB5IH06IFBvaW50ICkge1xyXG5cdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHggPj0gMCAmJiB4IDwgd2lkdGggJiYgeSA+PSAwICYmIHkgPCBoZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0KCB7IHgsIHkgfTogUG9pbnQgKSB7XHJcblx0XHR2YWxpZGF0ZSggdGhpcywgeyB4LCB5IH0gKTtcclxuXHRcdGNvbnN0IGtleSA9IEpTT04uc3RyaW5naWZ5KCB7IHgsIHkgfSApO1xyXG5cdFx0cmV0dXJuIHRoaXMuZGF0YS5nZXQoIGtleSApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCggeyB4LCB5IH06IFBvaW50LCB2YWx1ZTogVCApIHtcclxuXHRcdHZhbGlkYXRlKCB0aGlzLCB7IHgsIHkgfSApO1xyXG5cdFx0Y29uc3Qga2V5ID0gSlNPTi5zdHJpbmdpZnkoIHsgeCwgeSB9ICk7XHJcblx0XHR0aGlzLmRhdGEuc2V0KCBrZXksIHZhbHVlICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcblx0XHRmdW5jdGlvbiAqaXRlcmF0b3IoIHRoaXM6IEdyaWQ8VD4gKSB7XHJcblx0XHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcclxuXHRcdFx0Zm9yKCBsZXQgeCA9IDA7IHggPCB3aWR0aDsgKyt4IClcclxuXHRcdFx0Zm9yKCBsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7ICsrIHkgKSB7XHJcblx0XHRcdFx0eWllbGQgdGhpcy5nZXQoIHsgeCwgeSB9ICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVyYXRvci5jYWxsKCB0aGlzICkgYXMgSXRlcmFibGVJdGVyYXRvcjxUfHVuZGVmaW5lZD47XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGRhdGEgPSBuZXcgTWFwPHN0cmluZywgVD4oKTtcclxufVxyXG4iXX0=

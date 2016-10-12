System.register(["./grid", "./bounds", "./square"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var grid_1, bounds_1, square_1, Board;
    return {
        setters: [
            function (grid_1_1) {
                grid_1 = grid_1_1;
            },
            function (bounds_1_1) {
                bounds_1 = bounds_1_1;
            },
            function (square_1_1) {
                square_1 = square_1_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                    const grid = new grid_1.default(width, height), squareSize = { width: 64, height: 64 }, gutterSize = { width: 4, height: 4 }, bounds = new bounds_1.default(gutterSize.width, gutterSize.height, width * (squareSize.width + gutterSize.width) + gutterSize.width * 2, height * (squareSize.height + gutterSize.height) + gutterSize.height * 2);
                    for (let x = 0; x < width; ++x)
                        for (let y = 0; y < height; ++y) {
                            const position = { x, y }, bounds = new bounds_1.default(x * (squareSize.width + gutterSize.width) + gutterSize.width, y * (squareSize.height + gutterSize.height) + gutterSize.height, squareSize.width, squareSize.height);
                            grid.set({ x, y }, new square_1.default(position, bounds));
                        }
                    Object.assign(this, { grid, bounds });
                }
                reset() {
                    for (const square of this) {
                        square.enabled = true;
                        square.color = null;
                    }
                }
                [Symbol.iterator]() {
                    const { grid } = this;
                    return grid[Symbol.iterator]();
                }
                hitTest(pt) {
                    for (const square of this) {
                        if (square.bounds.hitTest(pt)) {
                            return square;
                        }
                    }
                    return null;
                }
            };
            exports_1("default", Board);
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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O2dCQUNiLENBQUM7YUFJRCxDQUFBOztRQUNELENBQUMiLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xyXG5pbXBvcnQgQm91bmRzIGZyb20gJy4vYm91bmRzJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuL3NxdWFyZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2FyZCB7XHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyICkge1xyXG5cdFx0Y29uc3QgZ3JpZCA9IG5ldyBHcmlkPFNxdWFyZT4oIHdpZHRoLCBoZWlnaHQgKSxcclxuXHRcdFx0c3F1YXJlU2l6ZTogU2l6ZSA9IHsgd2lkdGg6IDY0LCBoZWlnaHQ6IDY0IH0sXHJcblx0XHRcdGd1dHRlclNpemU6IFNpemUgPSB7IHdpZHRoOiA0LCBoZWlnaHQ6IDQgfSxcclxuXHRcdFx0Ym91bmRzID0gbmV3IEJvdW5kcyhcclxuXHRcdFx0XHRndXR0ZXJTaXplLndpZHRoLFxyXG5cdFx0XHRcdGd1dHRlclNpemUuaGVpZ2h0LFxyXG5cdFx0XHRcdHdpZHRoICogKCBzcXVhcmVTaXplLndpZHRoICsgZ3V0dGVyU2l6ZS53aWR0aCApICsgZ3V0dGVyU2l6ZS53aWR0aCAqIDIsXHJcblx0XHRcdFx0aGVpZ2h0ICogKCBzcXVhcmVTaXplLmhlaWdodCArIGd1dHRlclNpemUuaGVpZ2h0ICkgKyBndXR0ZXJTaXplLmhlaWdodCAqIDJcclxuXHRcdFx0KTtcclxuXHRcdGZvciggbGV0IHggPSAwOyB4IDwgd2lkdGg7ICsreCApXHJcblx0XHRmb3IoIGxldCB5ID0gMDsgeSA8IGhlaWdodDsgKyt5ICkge1xyXG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IHsgeCwgeSB9LFxyXG5cdFx0XHRcdGJvdW5kcyA9IG5ldyBCb3VuZHMoXHJcblx0XHRcdFx0XHR4ICogKCBzcXVhcmVTaXplLndpZHRoICsgZ3V0dGVyU2l6ZS53aWR0aCApICsgZ3V0dGVyU2l6ZS53aWR0aCAsXHJcblx0XHRcdFx0XHR5ICogKCBzcXVhcmVTaXplLmhlaWdodCArIGd1dHRlclNpemUuaGVpZ2h0ICkgKyBndXR0ZXJTaXplLmhlaWdodCxcclxuXHRcdFx0XHRcdHNxdWFyZVNpemUud2lkdGgsXHJcblx0XHRcdFx0XHRzcXVhcmVTaXplLmhlaWdodFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdGdyaWQuc2V0KCB7IHgsIHkgfSwgbmV3IFNxdWFyZSggcG9zaXRpb24sIGJvdW5kcyApICk7XHJcblx0XHR9XHJcblx0XHRPYmplY3QuYXNzaWduKCB0aGlzLCB7IGdyaWQsIGJvdW5kcyB9ICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVzZXQoKSB7XHJcblx0XHRmb3IoIGNvbnN0IHNxdWFyZSBvZiB0aGlzICkge1xyXG5cdFx0XHRzcXVhcmUuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHNxdWFyZS5jb2xvciA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcblx0XHRjb25zdCB7IGdyaWQgfSA9IHRoaXM7XHJcblx0XHRyZXR1cm4gZ3JpZFsgU3ltYm9sLml0ZXJhdG9yIF0oKSBhcyBJdGVyYWJsZUl0ZXJhdG9yPFNxdWFyZT47XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaGl0VGVzdCggcHQ6IFBvaW50ICk6IFNxdWFyZXxudWxsIHtcclxuXHRcdGZvciggY29uc3Qgc3F1YXJlIG9mIHRoaXMgKSB7XHJcblx0XHRcdGlmKCBzcXVhcmUuYm91bmRzLmhpdFRlc3QoIHB0ICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNxdWFyZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYm91bmRzOiBCb3VuZHM7XHJcblx0cHVibGljIGdyaWQ6IEdyaWQ8U3F1YXJlPjtcclxufVxyXG4iXX0=

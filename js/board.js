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
                    const grid = new grid_1.default(width, height), squareSize = { width: 64, height: 64 }, gutterSize = { width: 4, height: 4 }, bounds = new bounds_1.default(0, 0, width * (squareSize.width + gutterSize.width) + gutterSize.width, height * (squareSize.height + gutterSize.height) + gutterSize.height);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Ym9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xyXG5pbXBvcnQgQm91bmRzIGZyb20gJy4vYm91bmRzJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuL3NxdWFyZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2FyZCB7XHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyICkge1xyXG5cdFx0Y29uc3QgZ3JpZCA9IG5ldyBHcmlkPFNxdWFyZT4oIHdpZHRoLCBoZWlnaHQgKSxcclxuXHRcdFx0c3F1YXJlU2l6ZTogU2l6ZSA9IHsgd2lkdGg6IDY0LCBoZWlnaHQ6IDY0IH0sXHJcblx0XHRcdGd1dHRlclNpemU6IFNpemUgPSB7IHdpZHRoOiA0LCBoZWlnaHQ6IDQgfSxcclxuXHRcdFx0Ym91bmRzID0gbmV3IEJvdW5kcyhcclxuXHRcdFx0XHQwLFxyXG5cdFx0XHRcdDAsXHJcblx0XHRcdFx0d2lkdGggKiAoIHNxdWFyZVNpemUud2lkdGggKyBndXR0ZXJTaXplLndpZHRoICkgKyBndXR0ZXJTaXplLndpZHRoLFxyXG5cdFx0XHRcdGhlaWdodCAqICggc3F1YXJlU2l6ZS5oZWlnaHQgKyBndXR0ZXJTaXplLmhlaWdodCApICsgZ3V0dGVyU2l6ZS5oZWlnaHRcclxuXHRcdFx0KTtcclxuXHRcdGZvciggbGV0IHggPSAwOyB4IDwgd2lkdGg7ICsreCApXHJcblx0XHRmb3IoIGxldCB5ID0gMDsgeSA8IGhlaWdodDsgKyt5ICkge1xyXG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IHsgeCwgeSB9LFxyXG5cdFx0XHRcdGJvdW5kcyA9IG5ldyBCb3VuZHMoXHJcblx0XHRcdFx0XHR4ICogKCBzcXVhcmVTaXplLndpZHRoICsgZ3V0dGVyU2l6ZS53aWR0aCApICsgZ3V0dGVyU2l6ZS53aWR0aCxcclxuXHRcdFx0XHRcdHkgKiAoIHNxdWFyZVNpemUuaGVpZ2h0ICsgZ3V0dGVyU2l6ZS5oZWlnaHQgKSArIGd1dHRlclNpemUuaGVpZ2h0LFxyXG5cdFx0XHRcdFx0c3F1YXJlU2l6ZS53aWR0aCxcclxuXHRcdFx0XHRcdHNxdWFyZVNpemUuaGVpZ2h0XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0Z3JpZC5zZXQoIHsgeCwgeSB9LCBuZXcgU3F1YXJlKCBwb3NpdGlvbiwgYm91bmRzICkgKTtcclxuXHRcdH1cclxuXHRcdE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZ3JpZCwgYm91bmRzIH0gKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZXNldCgpIHtcclxuXHRcdGZvciggY29uc3Qgc3F1YXJlIG9mIHRoaXMgKSB7XHJcblx0XHRcdHNxdWFyZS5lbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0c3F1YXJlLmNvbG9yID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuXHRcdGNvbnN0IHsgZ3JpZCB9ID0gdGhpcztcclxuXHRcdHJldHVybiBncmlkWyBTeW1ib2wuaXRlcmF0b3IgXSgpIGFzIEl0ZXJhYmxlSXRlcmF0b3I8U3F1YXJlPjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBoaXRUZXN0KCBwdDogUG9pbnQgKTogU3F1YXJlfG51bGwge1xyXG5cdFx0Zm9yKCBjb25zdCBzcXVhcmUgb2YgdGhpcyApIHtcclxuXHRcdFx0aWYoIHNxdWFyZS5ib3VuZHMuaGl0VGVzdCggcHQgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gc3F1YXJlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBib3VuZHM6IEJvdW5kcztcclxuXHRwdWJsaWMgZ3JpZDogR3JpZDxTcXVhcmU+O1xyXG59XHJcbiJdfQ==

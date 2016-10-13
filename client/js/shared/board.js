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

//# sourceMappingURL=board.js.map

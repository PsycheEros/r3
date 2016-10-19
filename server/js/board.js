"use strict";
const grid_1 = require("./grid");
const bounds_1 = require("./bounds");
const square_1 = require("./square");
class Board {
    constructor() {
        this.bounds = new bounds_1.default(0, 0, 0, 0);
        this.grid = new grid_1.default(0, 0);
    }
    reset(width, height) {
        const grid = new grid_1.default(width, height), squareSize = { width: 64, height: 64 }, gutterSize = { width: 4, height: 4 }, bounds = new bounds_1.default(0, 0, width * (squareSize.width + gutterSize.width) + gutterSize.width, height * (squareSize.height + gutterSize.height) + gutterSize.height);
        for (let x = 0; x < width; ++x)
            for (let y = 0; y < height; ++y) {
                const position = { x, y }, bounds = new bounds_1.default(x * (squareSize.width + gutterSize.width) + gutterSize.width, y * (squareSize.height + gutterSize.height) + gutterSize.height, squareSize.width, squareSize.height);
                grid.set({ x, y }, new square_1.default(position, bounds));
            }
        Object.assign(this, { grid, bounds });
    }
    get width() {
        const { grid: { width } } = this;
        return width;
    }
    get height() {
        const { grid: { height } } = this;
        return height;
    }
    get({ x, y }) {
        const { grid } = this;
        return grid.get({ x, y });
    }
    boundsCheck({ x, y }) {
        const { grid } = this;
        return grid.boundsCheck({ x, y });
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
    serialize() {
        const { width, height } = this;
        let data = '';
        for (const { enabled, empty, color } of this) {
            data +=
                !enabled ? 'x'
                    : empty ? ' '
                        : color;
        }
        return { width, height, data };
    }
    static deserialize(data) {
        return (new Board).deserialize(data);
    }
    deserialize({ width, height, data }) {
        this.reset(width, height);
        let i = 0;
        for (const square of this) {
            const char = data[i++];
            switch (char) {
                case 'x':
                    square.enabled = false;
                    break;
                case ' ':
                    break;
                default:
                    square.color = parseInt(char, 10);
                    break;
            }
        }
        return this;
    }
    clone() {
        return Board.deserialize(this.serialize());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Board;

//# sourceMappingURL=board.js.map

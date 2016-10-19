"use strict";
class Square {
    constructor(position, bounds) {
        this.position = position;
        this.bounds = bounds;
        this.enabled = true;
        this.color = null;
    }
    get empty() { return this.color === null; }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Square;

//# sourceMappingURL=square.js.map

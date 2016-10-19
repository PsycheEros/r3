"use strict";
const board_1 = require("./board");
class GameState {
    constructor() {
        this.board = new board_1.default;
        this.turn = 0;
    }
    serialize() {
        const { board, turn } = this;
        return {
            board: board.serialize(),
            turn
        };
    }
    deserialize({ board, turn }) {
        this.board.deserialize(board);
        Object.assign(this, { turn });
        return this;
    }
    static deserialize(data) {
        return (new GameState).deserialize(data);
    }
    clone() {
        return GameState.deserialize(this.serialize());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameState;

//# sourceMappingURL=game-state.js.map

"use strict";
const directions = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 }
];
function getAffectedSquares(board, position, color) {
    if (!board.boundsCheck(position)) {
        return [];
    }
    const square = board.get(position);
    if (!square || !square.empty || !square.enabled) {
        return [];
    }
    function direction({ x, y }, delta) {
        const squares = [];
        for (;;) {
            x += delta.x;
            y += delta.y;
            if (!board.boundsCheck({ x, y })) {
                return [];
            }
            const square = board.get({ x, y });
            if (!square || square.empty || !square.enabled) {
                return [];
            }
            if (square.color === color) {
                return squares;
            }
            squares.push(square);
        }
    }
    const squares = [square];
    for (const delta of directions) {
        squares.splice(squares.length, 0, ...direction(position, delta));
    }
    if (squares.length <= 1) {
        return [];
    }
    return squares;
}
class Rules {
    isValid(board, position, color) {
        return getAffectedSquares(board, position, color).length > 0;
    }
    getValidMoves(board, color) {
        const squares = [];
        for (const square of board) {
            if (this.isValid(board, square.position, color)) {
                squares.push(square);
            }
        }
        return squares;
    }
    getColors(board) {
        const colors = new Set();
        for (let { color } of board) {
            if (Number.isSafeInteger(color)) {
                colors.add(color);
            }
        }
        return colors;
    }
    isGameOver(board) {
        for (const color of this.getColors(board)) {
            if (this.getValidMoves(board, color).length > 0) {
                return false;
            }
        }
        return true;
    }
    makeMove(gameState, position) {
        const { board, turn: color } = gameState, squares = getAffectedSquares(board, position, color);
        for (const square of squares) {
            square.color = color;
        }
        const { length } = squares;
        if (length > 0 && !this.isGameOver(board)) {
            do {
                gameState.turn = (gameState.turn + 1) % 2;
            } while (this.getValidMoves(board, gameState.turn).length <= 0);
        }
        return length;
    }
    getScore(board, color) {
        let score = 0;
        for (const square of board) {
            if (square && square.enabled && square.color === color) {
                ++score;
            }
        }
        return score;
    }
    reset(gameState) {
        const { board } = gameState;
        gameState.turn = 0;
        board.reset(8, 8);
        board.get({ x: 3, y: 3 }).color = 0;
        board.get({ x: 4, y: 3 }).color = 1;
        board.get({ x: 3, y: 4 }).color = 1;
        board.get({ x: 4, y: 4 }).color = 0;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rules;

//# sourceMappingURL=rules.js.map

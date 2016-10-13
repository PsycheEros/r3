System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getAffectedSquares(grid, position, color) {
        if (!grid.boundsCheck(position)) {
            return [];
        }
        const square = grid.get(position);
        if (!square || !square.empty || !square.enabled) {
            return [];
        }
        function direction({ x, y }, delta) {
            const squares = [];
            for (;;) {
                x += delta.x;
                y += delta.y;
                if (!grid.boundsCheck({ x, y })) {
                    return [];
                }
                const square = grid.get({ x, y });
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
    var directions, Rules;
    return {
        setters: [],
        execute: function () {
            directions = [
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 1 },
                { x: -1, y: 1 },
                { x: -1, y: 0 },
                { x: -1, y: -1 }
            ];
            Rules = class Rules {
                isValid(grid, position, color) {
                    return getAffectedSquares(grid, position, color).length > 0;
                }
                getValidMoves(grid, color) {
                    const squares = [];
                    for (const square of grid) {
                        if (square && this.isValid(grid, square.position, color)) {
                            squares.push(square);
                        }
                    }
                    return squares;
                }
                isGameOver(grid, colors) {
                    for (const color of colors) {
                        if (this.getValidMoves(grid, color).length > 0) {
                            return false;
                        }
                    }
                    return true;
                }
                makeMove(grid, position, color) {
                    const squares = getAffectedSquares(grid, position, color);
                    for (const square of squares) {
                        square.color = color;
                    }
                    return squares.length;
                }
                getScore(grid, color) {
                    let score = 0;
                    for (const square of grid) {
                        if (square && square.enabled && square.color === color) {
                            ++score;
                        }
                    }
                    return score;
                }
            };
            exports_1("default", Rules);
        }
    };
});

//# sourceMappingURL=rules.js.map

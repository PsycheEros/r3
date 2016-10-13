System.register(["./canvas2d", "./canvas3d", "../shared/board", "../shared/rules"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createCanvas(width, height) {
        return document.body.appendChild(Object.assign(document.createElement('canvas'), { width, height }));
    }
    var canvas2d_1, canvas3d_1, board_1, rules_1, width, height, canvas;
    return {
        setters: [
            function (canvas2d_1_1) {
                canvas2d_1 = canvas2d_1_1;
            },
            function (canvas3d_1_1) {
                canvas3d_1 = canvas3d_1_1;
            },
            function (board_1_1) {
                board_1 = board_1_1;
            },
            function (rules_1_1) {
                rules_1 = rules_1_1;
            }
        ],
        execute: function () {
            width = 960, height = 800, canvas = {
                '2d': new canvas2d_1.default(createCanvas(width, height)),
                '3d': new canvas3d_1.default(createCanvas(width, height))
            };
            (() => {
                const board = new board_1.default(8, 8);
                function newGame() {
                    board.reset();
                    board.grid.get({ x: 3, y: 3 }).color = 0;
                    board.grid.get({ x: 4, y: 3 }).color = 1;
                    board.grid.get({ x: 3, y: 4 }).color = 1;
                    board.grid.get({ x: 4, y: 4 }).color = 0;
                }
                newGame();
                const rules = new rules_1.default;
                const { c2d } = canvas['2d'];
                let turn = 0;
                function nextTurn() {
                    if (rules.isGameOver(board.grid, [0, 1])) {
                        return;
                    }
                    turn = (turn + 1) % 2;
                    if (rules.getValidMoves(board.grid, turn).length === 0) {
                        nextTurn();
                    }
                }
                let selectedSquare = null;
                function render(time) {
                    c2d.save();
                    canvas['2d'].clear();
                    c2d.fillStyle = '#6c6';
                    c2d.fillRect(board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height);
                    c2d.strokeStyle = 'black';
                    for (const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board) {
                        if (!enabled) {
                            continue;
                        }
                        c2d.save();
                        c2d.lineWidth = 1;
                        c2d.fillStyle = '#8c8';
                        c2d.fillRect(left, top, width, height);
                        c2d.strokeRect(left, top, width, height);
                        if (color !== null) {
                            c2d.lineWidth = 1;
                            c2d.fillStyle = color === 0 ? '#222' : '#ddd';
                            c2d.beginPath();
                            c2d.ellipse(center.x, center.y, width * .4, height * .4, 0, 0, Math.PI * 2);
                            c2d.fill();
                            c2d.stroke();
                        }
                        if (rules.isValid(board.grid, { x, y }, turn)) {
                            c2d.lineWidth = 8;
                            c2d.strokeStyle = turn === 0 ? '#222' : '#ddd';
                            c2d.beginPath();
                            c2d.moveTo(center.x - width * .25, center.y - height * .25);
                            c2d.lineTo(center.x + width * .25, center.y + height * .25);
                            c2d.moveTo(center.x + width * .25, center.y - height * .25);
                            c2d.lineTo(center.x - width * .25, center.y + height * .25);
                            c2d.stroke();
                        }
                        c2d.restore();
                    }
                    const lineHeight = 16, lines = [];
                    if (rules.isGameOver(board.grid, [0, 1])) {
                        lines.push('Game Over');
                    }
                    else {
                        lines.push(`${turn === 0 ? 'Black' : 'White'}'s turn`);
                    }
                    lines.push(`Black: ${rules.getScore(board.grid, 0)}`);
                    lines.push(`White: ${rules.getScore(board.grid, 1)}`);
                    c2d.save();
                    c2d.font = 'bold 16px sans-serif';
                    c2d.textBaseline = 'bottom';
                    c2d.textAlign = 'left';
                    c2d.shadowBlur = 5;
                    c2d.shadowColor = 'white';
                    c2d.fillStyle = 'black';
                    let top = lineHeight;
                    for (const line of lines) {
                        c2d.fillText(line, board.bounds.right, top);
                        top += lineHeight;
                    }
                    c2d.restore();
                    c2d.restore();
                    requestAnimationFrame(render);
                }
                requestAnimationFrame(render);
                function onMouseMove({ clientX, clientY }) {
                    const { x, y } = canvas['2d'].screenToCanvas({ x: clientX, y: clientY });
                    selectedSquare = board.hitTest({ x, y });
                    document.documentElement.style.cursor = selectedSquare && rules.isValid(board.grid, selectedSquare.position, turn) ? 'pointer' : null;
                }
                function onClick({ clientX, clientY }) {
                    if (rules.isGameOver(board.grid, [0, 1])) {
                        newGame();
                        return;
                    }
                    const { x, y } = canvas['2d'].screenToCanvas({ x: clientX, y: clientY }), square = board.hitTest({ x, y });
                    if (square) {
                        if (rules.makeMove(board.grid, square.position, turn)) {
                            nextTurn();
                        }
                    }
                }
                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('click', onClick, false);
                document.addEventListener('touchstart', e => {
                    for (const touch of Array.from(e.touches)) {
                        onClick(touch);
                    }
                }, false);
            })();
        }
    };
});

//# sourceMappingURL=default.js.map

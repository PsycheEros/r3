System.register(["./canvas2d", "./canvas3d", "./board", "./rules"], function (exports_1, context_1) {
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
                document.addEventListener('touchstart', onClick, false);
            })();
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO29CQUM3RixHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDMUIsR0FBRyxDQUFBLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEtBQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzNHLEVBQUUsQ0FBQSxDQUFFLENBQUMsT0FBUSxDQUFDLENBQUMsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBQUMsQ0FBQzt3QkFDNUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQzt3QkFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzt3QkFDekMsR0FBRyxDQUFDLFVBQVUsQ0FBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzt3QkFFM0MsRUFBRSxDQUFBLENBQUUsS0FBSyxLQUFLLElBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDOzRCQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQzs0QkFDOUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUNoQixHQUFHLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFF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YyxDQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUUsRUFDM0UsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQztvQkFDcEMsRUFBRSxDQUFBLENBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQzt3QkFDYixFQUFFLENBQUEsQ0FBRSxLQUFLLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQzFELFFBQVEsRUFBRSxDQUFDO3dCQUNaLENBQUM7b0JBQ0YsQ0FBQztnQkFDRixDQUFDO2dCQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBRSxDQUFDO2dCQUM3RCxRQUFRLENBQUMsZ0JBQWdCLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUUsQ0FBQztnQkFDckQsUUFBUSxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFFLEVBQUUsQ0FBQztRQUNOLENBQUMiLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMyRCBmcm9tICcuL2NhbnZhczJkJztcclxuaW1wb3J0IENhbnZhczNEIGZyb20gJy4vY2FudmFzM2QnO1xyXG5pbXBvcnQgQm9hcmQgZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSAnLi9zcXVhcmUnO1xyXG5pbXBvcnQgUnVsZXMgZnJvbSAnLi9ydWxlcyc7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyICkge1xyXG5cdHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFxyXG5cdFx0T2JqZWN0LmFzc2lnbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKSwgeyB3aWR0aCwgaGVpZ2h0IH0gKVxyXG5cdCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbn1cclxuXHJcbmNvbnN0IHdpZHRoID0gOTYwLFxyXG5cdGhlaWdodCA9IDgwMCxcclxuXHRjYW52YXMgPSB7XHJcblx0XHQnMmQnOiBuZXcgQ2FudmFzMkQoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApICksXHJcblx0XHQnM2QnOiBuZXcgQ2FudmFzM0QoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApIClcclxuXHR9O1xyXG5cclxuKCAoKSA9PiB7XHJcblx0Y29uc3QgYm9hcmQgPSBuZXcgQm9hcmQoIDgsIDggKTtcclxuXHJcblx0ZnVuY3Rpb24gbmV3R2FtZSgpIHtcclxuXHRcdGJvYXJkLnJlc2V0KCk7XHJcblx0XHRib2FyZC5ncmlkLmdldCggeyB4OiAzLCB5OiAzIH0gKSEuY29sb3IgPSAwO1xyXG5cdFx0Ym9hcmQuZ3JpZC5nZXQoIHsgeDogNCwgeTogMyB9ICkhLmNvbG9yID0gMTtcclxuXHRcdGJvYXJkLmdyaWQuZ2V0KCB7IHg6IDMsIHk6IDQgfSApIS5jb2xvciA9IDE7XHJcblx0XHRib2FyZC5ncmlkLmdldCggeyB4OiA0LCB5OiA0IH0gKSEuY29sb3IgPSAwO1xyXG5cdH1cclxuXHRuZXdHYW1lKCk7XHJcblxyXG5cdGNvbnN0IHJ1bGVzID0gbmV3IFJ1bGVzO1xyXG5cdGNvbnN0IHsgYzJkIH0gPSBjYW52YXNbICcyZCcgXTtcclxuXHRsZXQgdHVybiA9IDA7XHJcblx0ZnVuY3Rpb24gbmV4dFR1cm4oKSB7XHJcblx0XHRpZiggcnVsZXMuaXNHYW1lT3ZlciggYm9hcmQuZ3JpZCwgWyAwLCAxIF0gKSApIHsgcmV0dXJuOyB9XHJcblx0XHR0dXJuID0gKCB0dXJuICsgMSApICUgMjtcclxuXHRcdGlmKCBydWxlcy5nZXRWYWxpZE1vdmVzKCBib2FyZC5ncmlkLCB0dXJuICkubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRuZXh0VHVybigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV0IHNlbGVjdGVkU3F1YXJlOiBTcXVhcmV8bnVsbCA9IG51bGw7XHJcblx0ZnVuY3Rpb24gcmVuZGVyKCB0aW1lOiBudW1iZXIgKSB7XHJcblx0XHRjMmQuc2F2ZSgpO1xyXG5cdFx0Y2FudmFzWyAnMmQnIF0uY2xlYXIoKTtcclxuXHJcblx0XHRjMmQuZmlsbFN0eWxlID0gJyM2YzYnO1xyXG5cdFx0YzJkLmZpbGxSZWN0KCBib2FyZC5ib3VuZHMubGVmdCwgYm9hcmQuYm91bmRzLnRvcCwgYm9hcmQuYm91bmRzLndpZHRoLCBib2FyZC5ib3VuZHMuaGVpZ2h0ICk7XHJcblx0XHRjMmQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xyXG5cdFx0Zm9yKCBjb25zdCB7IGVuYWJsZWQsIGNvbG9yLCBwb3NpdGlvbjogeyB4LCB5IH0sIGJvdW5kczogeyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQsIGNlbnRlciB9IH0gb2YgYm9hcmQgKSB7XHJcblx0XHRcdGlmKCAhZW5hYmxlZCApIHsgY29udGludWU7IH1cclxuXHRcdFx0YzJkLnNhdmUoKTtcclxuXHRcdFx0YzJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdGMyZC5maWxsU3R5bGUgPSAnIzhjOCc7XHJcblx0XHRcdGMyZC5maWxsUmVjdCggbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0ICk7XHJcblx0XHRcdGMyZC5zdHJva2VSZWN0KCBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgKTtcclxuXHJcblx0XHRcdGlmKCBjb2xvciAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRjMmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHRjMmQuZmlsbFN0eWxlID0gY29sb3IgPT09IDAgPyAnIzIyMicgOiAnI2RkZCc7XHJcblx0XHRcdFx0YzJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdGMyZC5lbGxpcHNlKCBjZW50ZXIueCwgY2VudGVyLnksIHdpZHRoICogLjQsIGhlaWdodCAqIC40LCAwLCAwLCBNYXRoLlBJICogMiApO1xyXG5cdFx0XHRcdGMyZC5maWxsKCk7XHJcblx0XHRcdFx0YzJkLnN0cm9rZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiggcnVsZXMuaXNWYWxpZCggYm9hcmQuZ3JpZCwgeyB4LCB5IH0sIHR1cm4gKSApIHtcclxuXHRcdFx0XHRjMmQubGluZVdpZHRoID0gODtcclxuXHRcdFx0XHRjMmQuc3Ryb2tlU3R5bGUgPSB0dXJuID09PSAwID8gJyMyMjInIDogJyNkZGQnO1xyXG5cdFx0XHRcdGMyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRjMmQubW92ZVRvKCBjZW50ZXIueCAtIHdpZHRoICogLjI1LCBjZW50ZXIueSAtIGhlaWdodCAqIC4yNSApO1xyXG5cdFx0XHRcdGMyZC5saW5lVG8oIGNlbnRlci54ICsgd2lkdGggKiAuMjUsIGNlbnRlci55ICsgaGVpZ2h0ICogLjI1ICk7XHJcblx0XHRcdFx0YzJkLm1vdmVUbyggY2VudGVyLnggKyB3aWR0aCAqIC4yNSwgY2VudGVyLnkgLSBoZWlnaHQgKiAuMjUgKTtcclxuXHRcdFx0XHRjMmQubGluZVRvKCBjZW50ZXIueCAtIHdpZHRoICogLjI1LCBjZW50ZXIueSArIGhlaWdodCAqIC4yNSApO1xyXG5cdFx0XHRcdGMyZC5zdHJva2UoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YzJkLnJlc3RvcmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBsaW5lSGVpZ2h0ID0gMTYsXHJcblx0XHRcdGxpbmVzID0gW10gYXMgc3RyaW5nW107XHJcblx0XHRpZiggcnVsZXMuaXNHYW1lT3ZlciggYm9hcmQuZ3JpZCwgWyAwLCAxIF0gKSApIHtcclxuXHRcdFx0bGluZXMucHVzaCggJ0dhbWUgT3ZlcicgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxpbmVzLnB1c2goIGAke3R1cm4gPT09IDAgPyAnQmxhY2snIDogJ1doaXRlJ30ncyB0dXJuYCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxpbmVzLnB1c2goIGBCbGFjazogJHtydWxlcy5nZXRTY29yZShib2FyZC5ncmlkLDApfWAgKTtcclxuXHRcdGxpbmVzLnB1c2goIGBXaGl0ZTogJHtydWxlcy5nZXRTY29yZShib2FyZC5ncmlkLDEpfWAgKTtcclxuXHJcblx0XHRjMmQuc2F2ZSgpO1xyXG5cdFx0YzJkLmZvbnQgPSAnYm9sZCAxNnB4IHNhbnMtc2VyaWYnO1xyXG5cdFx0YzJkLnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xyXG5cdFx0YzJkLnRleHRBbGlnbiA9ICdsZWZ0JztcclxuXHRcdGMyZC5zaGFkb3dCbHVyID0gNTtcclxuXHRcdGMyZC5zaGFkb3dDb2xvciA9ICd3aGl0ZSc7XHJcblx0XHRjMmQuZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuXHRcdGxldCB0b3AgPSBsaW5lSGVpZ2h0O1xyXG5cdFx0Zm9yKCBjb25zdCBsaW5lIG9mIGxpbmVzICkge1xyXG5cdFx0XHRjMmQuZmlsbFRleHQoIGxpbmUsIGJvYXJkLmJvdW5kcy5yaWdodCwgdG9wICk7XHJcblx0XHRcdHRvcCArPSBsaW5lSGVpZ2h0O1xyXG5cdFx0fVxyXG5cdFx0YzJkLnJlc3RvcmUoKTtcclxuXHJcblx0XHRjMmQucmVzdG9yZSgpO1xyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByZW5kZXIgKTtcclxuXHR9XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByZW5kZXIgKTtcclxuXHJcblx0ZnVuY3Rpb24gb25Nb3VzZU1vdmUoIHsgY2xpZW50WCwgY2xpZW50WSB9OiBNb3VzZUV2ZW50ICkge1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBjYW52YXNbICcyZCcgXS5zY3JlZW5Ub0NhbnZhcyggeyB4OiBjbGllbnRYLCB5OiBjbGllbnRZIH0gKTtcclxuXHRcdHNlbGVjdGVkU3F1YXJlID0gYm9hcmQuaGl0VGVzdCggeyB4LCB5IH0gKTtcclxuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5jdXJzb3IgPSBzZWxlY3RlZFNxdWFyZSAmJiBydWxlcy5pc1ZhbGlkKCBib2FyZC5ncmlkLCBzZWxlY3RlZFNxdWFyZS5wb3NpdGlvbiwgdHVybiApID8gJ3BvaW50ZXInIDogbnVsbDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG9uQ2xpY2soIHsgY2xpZW50WCwgY2xpZW50WSB9OiBNb3VzZUV2ZW50ICkge1xyXG5cdFx0aWYoIHJ1bGVzLmlzR2FtZU92ZXIoIGJvYXJkLmdyaWQsIFsgMCwgMSBdICkgKSB7XHJcblx0XHRcdG5ld0dhbWUoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzWyAnMmQnIF0uc2NyZWVuVG9DYW52YXMoIHsgeDogY2xpZW50WCwgeTogY2xpZW50WSB9ICksXHJcblx0XHRcdHNxdWFyZSA9IGJvYXJkLmhpdFRlc3QoIHsgeCwgeSB9ICk7XHJcblx0XHRpZiggc3F1YXJlICkge1xyXG5cdFx0XHRpZiggcnVsZXMubWFrZU1vdmUoIGJvYXJkLmdyaWQsIHNxdWFyZS5wb3NpdGlvbiwgdHVybiApICkge1xyXG5cdFx0XHRcdG5leHRUdXJuKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UgKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvbkNsaWNrLCBmYWxzZSApO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgb25DbGljaywgZmFsc2UgKTtcclxufSApKCk7XHJcbiJdfQ==

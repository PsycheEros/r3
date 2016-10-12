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
                    c2d.strokeStyle = 'black';
                    canvas['2d'].clear();
                    for (const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board) {
                        if (!enabled) {
                            continue;
                        }
                        c2d.save();
                        c2d.lineWidth = 1;
                        c2d.fillStyle = (x + y) % 2 === 0 ? '#000' : '#fff';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEtBQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzNHLEVBQUUsQ0FBQSxDQUFFLENBQUMsT0FBUSxDQUFDLENBQUMsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBQUMsQ0FBQzt3QkFDNUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3QkFDdEQsR0FBRyxDQUFDLFFBQVEsQ0FBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzt3QkFDekMsR0FBRyxDQUFDLFVBQVUsQ0FBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzt3QkFFM0MsRUFBRSxDQUFBLENBQUUsS0FBSyxLQUFLLElBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3JCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDOzRCQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQzs0QkFDOUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUNoQixHQUFHLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRSxDQUFDOzRCQUM5RSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ1gsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUNkLENBQUM7d0JBRUQsRUFB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QkFDcEMsRUFBRSxDQUFBLENBQUUsTUFBTyxDQUFDLENBQUMsQ0FBQzt3QkFDYixFQUFFLENBQUEsQ0FBRSxLQUFLLENBQUMsUUFBUSxDQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQzFELFFBQVEsRUFBRSxDQUFDO3dCQUNaLENBQUM7b0JBQ0YsQ0FBQztnQkFDRixDQUFDO2dCQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBRSxDQUFDO2dCQUM3RCxRQUFRLENBQUMsZ0JBQWdCLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUUsQ0FBQztnQkFDckQsUUFBUSxDQUFDLGdCQUFnQixDQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFFLEVBQUUsQ0FBQztRQUNOLENBQUMiLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMyRCBmcm9tICcuL2NhbnZhczJkJztcclxuaW1wb3J0IENhbnZhczNEIGZyb20gJy4vY2FudmFzM2QnO1xyXG5pbXBvcnQgQm9hcmQgZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSAnLi9zcXVhcmUnO1xyXG5pbXBvcnQgUnVsZXMgZnJvbSAnLi9ydWxlcyc7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyICkge1xyXG5cdHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFxyXG5cdFx0T2JqZWN0LmFzc2lnbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKSwgeyB3aWR0aCwgaGVpZ2h0IH0gKVxyXG5cdCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbn1cclxuXHJcbmNvbnN0IHdpZHRoID0gOTYwLFxyXG5cdGhlaWdodCA9IDgwMCxcclxuXHRjYW52YXMgPSB7XHJcblx0XHQnMmQnOiBuZXcgQ2FudmFzMkQoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApICksXHJcblx0XHQnM2QnOiBuZXcgQ2FudmFzM0QoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApIClcclxuXHR9O1xyXG5cclxuKCAoKSA9PiB7XHJcblx0Y29uc3QgYm9hcmQgPSBuZXcgQm9hcmQoIDgsIDggKTtcclxuXHJcblx0ZnVuY3Rpb24gbmV3R2FtZSgpIHtcclxuXHRcdGJvYXJkLnJlc2V0KCk7XHJcblx0XHRib2FyZC5ncmlkLmdldCggeyB4OiAzLCB5OiAzIH0gKSEuY29sb3IgPSAwO1xyXG5cdFx0Ym9hcmQuZ3JpZC5nZXQoIHsgeDogNCwgeTogMyB9ICkhLmNvbG9yID0gMTtcclxuXHRcdGJvYXJkLmdyaWQuZ2V0KCB7IHg6IDMsIHk6IDQgfSApIS5jb2xvciA9IDE7XHJcblx0XHRib2FyZC5ncmlkLmdldCggeyB4OiA0LCB5OiA0IH0gKSEuY29sb3IgPSAwO1xyXG5cdH1cclxuXHRuZXdHYW1lKCk7XHJcblxyXG5cdGNvbnN0IHJ1bGVzID0gbmV3IFJ1bGVzO1xyXG5cdGNvbnN0IHsgYzJkIH0gPSBjYW52YXNbICcyZCcgXTtcclxuXHRsZXQgdHVybiA9IDA7XHJcblx0ZnVuY3Rpb24gbmV4dFR1cm4oKSB7XHJcblx0XHRpZiggcnVsZXMuaXNHYW1lT3ZlciggYm9hcmQuZ3JpZCwgWyAwLCAxIF0gKSApIHsgcmV0dXJuOyB9XHJcblx0XHR0dXJuID0gKCB0dXJuICsgMSApICUgMjtcclxuXHRcdGlmKCBydWxlcy5nZXRWYWxpZE1vdmVzKCBib2FyZC5ncmlkLCB0dXJuICkubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRuZXh0VHVybigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bGV0IHNlbGVjdGVkU3F1YXJlOiBTcXVhcmV8bnVsbCA9IG51bGw7XHJcblx0ZnVuY3Rpb24gcmVuZGVyKCB0aW1lOiBudW1iZXIgKSB7XHJcblx0XHRjMmQuc2F2ZSgpO1xyXG5cclxuXHRcdGMyZC5zdHJva2VTdHlsZSA9ICdibGFjayc7XHJcblx0XHRjYW52YXNbICcyZCcgXS5jbGVhcigpO1xyXG5cdFx0Zm9yKCBjb25zdCB7IGVuYWJsZWQsIGNvbG9yLCBwb3NpdGlvbjogeyB4LCB5IH0sIGJvdW5kczogeyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQsIGNlbnRlciB9IH0gb2YgYm9hcmQgKSB7XHJcblx0XHRcdGlmKCAhZW5hYmxlZCApIHsgY29udGludWU7IH1cclxuXHRcdFx0YzJkLnNhdmUoKTtcclxuXHRcdFx0YzJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdGMyZC5maWxsU3R5bGUgPSAoIHggKyB5ICkgJSAyID09PSAwID8gJyMwMDAnIDogJyNmZmYnO1xyXG5cdFx0XHRjMmQuZmlsbFJlY3QoIGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCApO1xyXG5cdFx0XHRjMmQuc3Ryb2tlUmVjdCggbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0ICk7XHJcblxyXG5cdFx0XHRpZiggY29sb3IgIT09IG51bGwgKSB7XHJcblx0XHRcdFx0YzJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0YzJkLmZpbGxTdHlsZSA9IGNvbG9yID09PSAwID8gJyMyMjInIDogJyNkZGQnO1xyXG5cdFx0XHRcdGMyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRjMmQuZWxsaXBzZSggY2VudGVyLngsIGNlbnRlci55LCB3aWR0aCAqIC40LCBoZWlnaHQgKiAuNCwgMCwgMCwgTWF0aC5QSSAqIDIgKTtcclxuXHRcdFx0XHRjMmQuZmlsbCgpO1xyXG5cdFx0XHRcdGMyZC5zdHJva2UoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoIHJ1bGVzLmlzVmFsaWQoIGJvYXJkLmdyaWQsIHsgeCwgeSB9LCB0dXJuICkgKSB7XHJcblx0XHRcdFx0YzJkLmxpbmVXaWR0aCA9IDg7XHJcblx0XHRcdFx0YzJkLnN0cm9rZVN0eWxlID0gdHVybiA9PT0gMCA/ICcjMjIyJyA6ICcjZGRkJztcclxuXHRcdFx0XHRjMmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0YzJkLm1vdmVUbyggY2VudGVyLnggLSB3aWR0aCAqIC4yNSwgY2VudGVyLnkgLSBoZWlnaHQgKiAuMjUgKTtcclxuXHRcdFx0XHRjMmQubGluZVRvKCBjZW50ZXIueCArIHdpZHRoICogLjI1LCBjZW50ZXIueSArIGhlaWdodCAqIC4yNSApO1xyXG5cdFx0XHRcdGMyZC5tb3ZlVG8oIGNlbnRlci54ICsgd2lkdGggKiAuMjUsIGNlbnRlci55IC0gaGVpZ2h0ICogLjI1ICk7XHJcblx0XHRcdFx0YzJkLmxpbmVUbyggY2VudGVyLnggLSB3aWR0aCAqIC4yNSwgY2VudGVyLnkgKyBoZWlnaHQgKiAuMjUgKTtcclxuXHRcdFx0XHRjMmQuc3Ryb2tlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGMyZC5yZXN0b3JlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgbGluZUhlaWdodCA9IDE2LFxyXG5cdFx0XHRsaW5lcyA9IFtdIGFzIHN0cmluZ1tdO1xyXG5cdFx0aWYoIHJ1bGVzLmlzR2FtZU92ZXIoIGJvYXJkLmdyaWQsIFsgMCwgMSBdICkgKSB7XHJcblx0XHRcdGxpbmVzLnB1c2goICdHYW1lIE92ZXInICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsaW5lcy5wdXNoKCBgJHt0dXJuID09PSAwID8gJ0JsYWNrJyA6ICdXaGl0ZSd9J3MgdHVybmAgKTtcclxuXHRcdH1cclxuXHJcblx0XHRsaW5lcy5wdXNoKCBgQmxhY2s6ICR7cnVsZXMuZ2V0U2NvcmUoYm9hcmQuZ3JpZCwwKX1gICk7XHJcblx0XHRsaW5lcy5wdXNoKCBgV2hpdGU6ICR7cnVsZXMuZ2V0U2NvcmUoYm9hcmQuZ3JpZCwxKX1gICk7XHJcblxyXG5cdFx0YzJkLnNhdmUoKTtcclxuXHRcdGMyZC5mb250ID0gJ2JvbGQgMTZweCBzYW5zLXNlcmlmJztcclxuXHRcdGMyZC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcclxuXHRcdGMyZC50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcblx0XHRjMmQuc2hhZG93Qmx1ciA9IDU7XHJcblx0XHRjMmQuc2hhZG93Q29sb3IgPSAnd2hpdGUnO1xyXG5cdFx0YzJkLmZpbGxTdHlsZSA9ICdibGFjayc7XHJcblx0XHRsZXQgdG9wID0gbGluZUhlaWdodDtcclxuXHRcdGZvciggY29uc3QgbGluZSBvZiBsaW5lcyApIHtcclxuXHRcdFx0YzJkLmZpbGxUZXh0KCBsaW5lLCBib2FyZC5ib3VuZHMucmlnaHQsIHRvcCApO1xyXG5cdFx0XHR0b3AgKz0gbGluZUhlaWdodDtcclxuXHRcdH1cclxuXHRcdGMyZC5yZXN0b3JlKCk7XHJcblxyXG5cdFx0YzJkLnJlc3RvcmUoKTtcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSggcmVuZGVyICk7XHJcblx0fVxyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSggcmVuZGVyICk7XHJcblxyXG5cdGZ1bmN0aW9uIG9uTW91c2VNb3ZlKCB7IGNsaWVudFgsIGNsaWVudFkgfTogTW91c2VFdmVudCApIHtcclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzWyAnMmQnIF0uc2NyZWVuVG9DYW52YXMoIHsgeDogY2xpZW50WCwgeTogY2xpZW50WSB9ICk7XHJcblx0XHRzZWxlY3RlZFNxdWFyZSA9IGJvYXJkLmhpdFRlc3QoIHsgeCwgeSB9ICk7XHJcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuY3Vyc29yID0gc2VsZWN0ZWRTcXVhcmUgJiYgcnVsZXMuaXNWYWxpZCggYm9hcmQuZ3JpZCwgc2VsZWN0ZWRTcXVhcmUucG9zaXRpb24sIHR1cm4gKSA/ICdwb2ludGVyJyA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvbkNsaWNrKCB7IGNsaWVudFgsIGNsaWVudFkgfTogTW91c2VFdmVudCApIHtcclxuXHRcdGlmKCBydWxlcy5pc0dhbWVPdmVyKCBib2FyZC5ncmlkLCBbIDAsIDEgXSApICkge1xyXG5cdFx0XHRuZXdHYW1lKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNhbnZhc1sgJzJkJyBdLnNjcmVlblRvQ2FudmFzKCB7IHg6IGNsaWVudFgsIHk6IGNsaWVudFkgfSApLFxyXG5cdFx0XHRzcXVhcmUgPSBib2FyZC5oaXRUZXN0KCB7IHgsIHkgfSApO1xyXG5cdFx0aWYoIHNxdWFyZSApIHtcclxuXHRcdFx0aWYoIHJ1bGVzLm1ha2VNb3ZlKCBib2FyZC5ncmlkLCBzcXVhcmUucG9zaXRpb24sIHR1cm4gKSApIHtcclxuXHRcdFx0XHRuZXh0VHVybigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlICk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25DbGljaywgZmFsc2UgKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIG9uQ2xpY2ssIGZhbHNlICk7XHJcbn0gKSgpO1xyXG4iXX0=

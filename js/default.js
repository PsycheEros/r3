System.register(["./canvas2d", "./canvas3d", "./board"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createCanvas(width, height) {
        return document.querySelector('body').appendChild(Object.assign(document.createElement('canvas'), { width, height }));
    }
    var canvas2d_1, canvas3d_1, board_1, body, width, height, canvas;
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
            }
        ],
        execute: function () {
            body = document.querySelector('body'), width = 960, height = 800, canvas = {
                '2d': new canvas2d_1.default(createCanvas(width, height)),
                '3d': new canvas3d_1.default(createCanvas(width, height))
            };
            (() => {
                const board = new board_1.default(8, 8);
                const { c2d } = canvas['2d'];
                let selectedSquare = null;
                function render(time) {
                    canvas['2d'].clear();
                    for (const { position: { x, y }, bounds } of board) {
                        c2d.fillStyle = (x + y) % 2 === 0 ? 'black' : 'white';
                        c2d.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
                    }
                    if (selectedSquare) {
                        c2d.strokeStyle = '#f00';
                        c2d.strokeRect(selectedSquare.bounds.left, selectedSquare.bounds.top, selectedSquare.bounds.width, selectedSquare.bounds.height);
                    }
                    requestAnimationFrame(render);
                }
                requestAnimationFrame(render);
                document.addEventListener('mousemove', ({ clientX, clientY }) => {
                    const { x, y } = canvas['2d'].screenToCanvas({ x: clientX, y: clientY });
                    selectedSquare = board.hitTest({ x, y });
                }, false);
            })();
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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b20gJy4vY2FudmFzMmQnO1xyXG5pbXBvcnQgQ2FudmFzM0QgZnJvbSAnLi9jYW52YXMzZCc7XHJcbmltcG9ydCBCb2FyZCBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuL3NxdWFyZSc7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyICkge1xyXG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnYm9keScgKSEuYXBwZW5kQ2hpbGQoXHJcblx0XHRPYmplY3QuYXNzaWduKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApLCB7IHdpZHRoLCBoZWlnaHQgfSApXHJcblx0KSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxufVxyXG5cclxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdib2R5JyApLFxyXG5cdHdpZHRoID0gOTYwLFxyXG5cdGhlaWdodCA9IDgwMCxcclxuXHRjYW52YXMgPSB7XHJcblx0XHQnMmQnOiBuZXcgQ2FudmFzMkQoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApICksXHJcblx0XHQnM2QnOiBuZXcgQ2FudmFzM0QoIGNyZWF0ZUNhbnZhcyggd2lkdGgsIGhlaWdodCApIClcclxuXHR9O1xyXG5cclxuKCAoKSA9PiB7XHJcblx0Y29uc3QgYm9hcmQgPSBuZXcgQm9hcmQoIDgsIDggKTtcclxuXHRjb25zdCB7IGMyZCB9ID0gY2FudmFzWyAnMmQnIF07XHJcblxyXG5cdGxldCBzZWxlY3RlZFNxdWFyZTogU3F1YXJlfG51bGwgPSBudWxsO1xyXG5cdGZ1bmN0aW9uIHJlbmRlciggdGltZTogbnVtYmVyICkge1xyXG5cdFx0Y2FudmFzWyAnMmQnIF0uY2xlYXIoKTtcclxuXHRcdGZvciggY29uc3QgeyBwb3NpdGlvbjogeyB4LCB5IH0sIGJvdW5kcyB9IG9mIGJvYXJkICkge1xyXG5cdFx0XHRjMmQuZmlsbFN0eWxlID0gKCB4ICsgeSApICUgMiA9PT0gMCA/ICdibGFjaycgOiAnd2hpdGUnO1xyXG5cdFx0XHRjMmQuZmlsbFJlY3QoIGJvdW5kcy5sZWZ0LCBib3VuZHMudG9wLCBib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQgKTtcclxuXHRcdH1cclxuXHRcdGlmKCBzZWxlY3RlZFNxdWFyZSApIHtcclxuXHRcdFx0YzJkLnN0cm9rZVN0eWxlID0gJyNmMDAnO1xyXG5cdFx0XHRjMmQuc3Ryb2tlUmVjdCggc2VsZWN0ZWRTcXVhcmUuYm91bmRzLmxlZnQsIHNlbGVjdGVkU3F1YXJlLmJvdW5kcy50b3AsIHNlbGVjdGVkU3F1YXJlLmJvdW5kcy53aWR0aCwgc2VsZWN0ZWRTcXVhcmUuYm91bmRzLmhlaWdodCApO1xyXG5cdFx0fVxyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByZW5kZXIgKTtcclxuXHR9XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByZW5kZXIgKTtcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsICggeyBjbGllbnRYLCBjbGllbnRZIH0gKSA9PiB7XHJcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNhbnZhc1sgJzJkJyBdLnNjcmVlblRvQ2FudmFzKCB7IHg6IGNsaWVudFgsIHk6IGNsaWVudFkgfSApO1xyXG5cdFx0c2VsZWN0ZWRTcXVhcmUgPSBib2FyZC5oaXRUZXN0KCB7IHgsIHkgfSApO1xyXG5cdH0sIGZhbHNlICk7XHJcbn0gKSgpO1xyXG4iXX0=

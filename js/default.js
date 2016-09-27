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

//# sourceMappingURL=data:application/json;base64,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b20gJy4vY2FudmFzMmQnO1xyXG5pbXBvcnQgQ2FudmFzM0QgZnJvbSAnLi9jYW52YXMzZCc7XHJcbmltcG9ydCBCb2FyZCBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuL3NxdWFyZSc7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyICkge1xyXG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnYm9keScgKS5hcHBlbmRDaGlsZChcclxuXHRcdE9iamVjdC5hc3NpZ24oIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICksIHsgd2lkdGgsIGhlaWdodCB9IClcclxuXHQpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG59XHJcblxyXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2JvZHknICksXHJcblx0d2lkdGggPSA5NjAsXHJcblx0aGVpZ2h0ID0gODAwLFxyXG5cdGNhbnZhcyA9IHtcclxuXHRcdCcyZCc6IG5ldyBDYW52YXMyRCggY3JlYXRlQ2FudmFzKCB3aWR0aCwgaGVpZ2h0ICkgKSxcclxuXHRcdCczZCc6IG5ldyBDYW52YXMzRCggY3JlYXRlQ2FudmFzKCB3aWR0aCwgaGVpZ2h0ICkgKVxyXG5cdH07XHJcblxyXG4oICgpID0+IHtcclxuXHRjb25zdCBib2FyZCA9IG5ldyBCb2FyZCggOCwgOCApO1xyXG5cdGNvbnN0IHsgYzJkIH0gPSBjYW52YXNbICcyZCcgXTtcclxuXHJcblx0bGV0IHNlbGVjdGVkU3F1YXJlOiBTcXVhcmV8bnVsbCA9IG51bGw7XHJcblx0ZnVuY3Rpb24gcmVuZGVyKCB0aW1lOiBudW1iZXIgKSB7XHJcblx0XHRjYW52YXNbICcyZCcgXS5jbGVhcigpO1xyXG5cdFx0Zm9yKCBjb25zdCB7IHBvc2l0aW9uOiB7IHgsIHkgfSwgYm91bmRzIH0gb2YgYm9hcmQgKSB7XHJcblx0XHRcdGMyZC5maWxsU3R5bGUgPSAoIHggKyB5ICkgJSAyID09PSAwID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XHJcblx0XHRcdGMyZC5maWxsUmVjdCggYm91bmRzLmxlZnQsIGJvdW5kcy50b3AsIGJvdW5kcy53aWR0aCwgYm91bmRzLmhlaWdodCApO1xyXG5cdFx0fVxyXG5cdFx0aWYoIHNlbGVjdGVkU3F1YXJlICkge1xyXG5cdFx0XHRjMmQuc3Ryb2tlU3R5bGUgPSAnI2YwMCc7XHJcblx0XHRcdGMyZC5zdHJva2VSZWN0KCBzZWxlY3RlZFNxdWFyZS5ib3VuZHMubGVmdCwgc2VsZWN0ZWRTcXVhcmUuYm91bmRzLnRvcCwgc2VsZWN0ZWRTcXVhcmUuYm91bmRzLndpZHRoLCBzZWxlY3RlZFNxdWFyZS5ib3VuZHMuaGVpZ2h0ICk7XHJcblx0XHR9XHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJlbmRlciApO1xyXG5cdH1cclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJlbmRlciApO1xyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgKCB7IGNsaWVudFgsIGNsaWVudFkgfSApID0+IHtcclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzWyAnMmQnIF0uc2NyZWVuVG9DYW52YXMoIHsgeDogY2xpZW50WCwgeTogY2xpZW50WSB9ICk7XHJcblx0XHRzZWxlY3RlZFNxdWFyZSA9IGJvYXJkLmhpdFRlc3QoIHsgeCwgeSB9ICk7XHJcblx0fSwgZmFsc2UgKTtcclxufSApKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

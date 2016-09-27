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
                const squareSize = 64;
                const { c2d } = canvas['2d'];
                for (const { x, y } of board) {
                    c2d.fillStyle = (x + y) % 2 === 0 ? 'black' : 'white';
                    c2d.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
                }
                const info = body.appendChild(document.createElement('div'));
                Object.assign(info.style, {
                    whiteSpace: 'pre',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                });
                document.addEventListener('mousemove', ({ clientX, clientY }) => {
                    const { x, y } = canvas['2d'].screenToCanvas({ x: clientX, y: clientY });
                    const { x: roundX, y: roundY } = canvas['2d'].canvasToScreen({ x, y });
                    info.textContent = `
Client: (${clientX}, ${clientY}
Screen: (${x}, ${y})
Round: (${roundX}, ${roundY})
`;
                }, false);
            })();
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2RlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBSUEsc0JBQXVCLEtBQWEsRUFBRSxNQUFjO1FBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFFLE1BQU0sQ0FBRSxDQUFDLFdBQVcsQ0FDbEQsTUFBTSxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFFLENBQ2pELENBQUM7SUFDeEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O1lBRUssSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUUsTUFBTSxDQUFFLEVBQzVDLEtBQUssR0FBRyxHQUFHLEVBQ1gsTUFBTSxHQUFHLEdBQUcsRUFDWixNQUFNLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLElBQUksa0JBQVEsQ0FBRSxZQUFZLENBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBRSxDQUFFO2dCQUNuRCxJQUFJLEVBQUUsSUFBSSxrQkFBUSxDQUFFLFlBQVksQ0FBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUU7YUFDbkQsQ0FBQztZQUVILENBQUU7Z0JBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUNoQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQSxDQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksS0FBTSxDQUFDLENBQUMsQ0FBQztvQkFDL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ3hELEdBQUcsQ0FBQyxRQUFRLENBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUUsQ0FBQztnQkFDeEUsQ0FBQztnQkFDRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUUsS0FBSyxDQUFFLENBQWlCLENBQUM7Z0JBQ2hGLE1BQU0sQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDMUIsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLFFBQVEsRUFBRSxPQUFPO29CQUNqQixNQUFNLEVBQUUsQ0FBQztvQkFDVCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxLQUFLLEVBQUUsQ0FBQztpQkFDUixDQUFFLENBQUM7Z0JBQ0osUUFBUSxDQUFDLGdCQUFnQixDQUFFLFdBQVcsRUFBRSxDQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtvQkFDN0QsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUMsY0FBYyxDQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztvQkFDN0UsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBRSxJQUFJLENBQUUsQ0FBQyxjQUFjLENBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQztvQkFDM0UsSUFBSSxDQUFDLFdBQVcsR0FBRztXQUNWLE9BQU8sS0FBSyxPQUFPO1dBQ25CLENBQUMsS0FBSyxDQUFDO1VBQ1IsTUFBTSxLQUFLLE1BQU07Q0FDMUIsQ0FBQztnQkFDRCxDQUFDLEVBQUUsS0FBSyxDQUFFLENBQUM7WUFDWixDQUFDLENBQUUsRUFBRSxDQUFDO1FBQ04sQ0FBQyIsImZpbGUiOiJkZWZhdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbnZhczJEIGZyb20gJy4vY2FudmFzMmQnO1xyXG5pbXBvcnQgQ2FudmFzM0QgZnJvbSAnLi9jYW52YXMzZCc7XHJcbmltcG9ydCBCb2FyZCBmcm9tICcuL2JvYXJkJztcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyggd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgKSB7XHJcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdib2R5JyApLmFwcGVuZENoaWxkKFxyXG5cdFx0T2JqZWN0LmFzc2lnbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKSwgeyB3aWR0aCwgaGVpZ2h0IH0gKVxyXG5cdCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbn1cclxuXHJcbmNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnYm9keScgKSxcclxuXHR3aWR0aCA9IDk2MCxcclxuXHRoZWlnaHQgPSA4MDAsXHJcblx0Y2FudmFzID0ge1xyXG5cdFx0JzJkJzogbmV3IENhbnZhczJEKCBjcmVhdGVDYW52YXMoIHdpZHRoLCBoZWlnaHQgKSApLFxyXG5cdFx0JzNkJzogbmV3IENhbnZhczNEKCBjcmVhdGVDYW52YXMoIHdpZHRoLCBoZWlnaHQgKSApXHJcblx0fTtcclxuXHJcbiggKCkgPT4ge1xyXG5cdGNvbnN0IGJvYXJkID0gbmV3IEJvYXJkKCA4LCA4ICk7XHJcblx0Y29uc3Qgc3F1YXJlU2l6ZSA9IDY0O1xyXG5cdGNvbnN0IHsgYzJkIH0gPSBjYW52YXNbICcyZCcgXTtcclxuXHRmb3IoIGNvbnN0IHsgeCwgeSB9IG9mIGJvYXJkICkge1xyXG5cdFx0YzJkLmZpbGxTdHlsZSA9ICggeCArIHkgKSAlIDIgPT09IDAgPyAnYmxhY2snIDogJ3doaXRlJztcclxuXHRcdGMyZC5maWxsUmVjdCggeCAqIHNxdWFyZVNpemUsIHkgKiBzcXVhcmVTaXplLCBzcXVhcmVTaXplLCBzcXVhcmVTaXplICk7XHJcblx0fVxyXG5cdGNvbnN0IGluZm8gPSBib2R5LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApICkgYXMgSFRNTEVsZW1lbnQ7XHJcblx0T2JqZWN0LmFzc2lnbiggaW5mby5zdHlsZSwge1xyXG5cdFx0d2hpdGVTcGFjZTogJ3ByZScsXHJcblx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcclxuXHRcdGJvdHRvbTogMCxcclxuXHRcdGxlZnQ6IDAsXHJcblx0XHRyaWdodDogMFxyXG5cdH0gKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgKCB7IGNsaWVudFgsIGNsaWVudFkgfSApID0+IHtcclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzWyAnMmQnIF0uc2NyZWVuVG9DYW52YXMoIHsgeDogY2xpZW50WCwgeTogY2xpZW50WSB9ICk7XHJcblx0XHRjb25zdCB7IHg6IHJvdW5kWCwgeTogcm91bmRZIH0gPSBjYW52YXNbICcyZCcgXS5jYW52YXNUb1NjcmVlbiggeyB4LCB5IH0gKTtcclxuXHRcdGluZm8udGV4dENvbnRlbnQgPSBgXHJcbkNsaWVudDogKCR7Y2xpZW50WH0sICR7Y2xpZW50WX1cclxuU2NyZWVuOiAoJHt4fSwgJHt5fSlcclxuUm91bmQ6ICgke3JvdW5kWH0sICR7cm91bmRZfSlcclxuYDtcclxuXHR9LCBmYWxzZSApO1xyXG59ICkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

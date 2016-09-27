System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Canvas;
    return {
        setters: [],
        execute: function () {
            Canvas = class Canvas {
                constructor(canvas) {
                    this.canvas = canvas;
                }
                get width() {
                    const { canvas } = this;
                    return canvas.width;
                }
                set width(value) {
                    const { canvas } = this;
                    canvas.width = value;
                }
                get height() {
                    const { canvas } = this;
                    return canvas.height;
                }
                set height(value) {
                    const { canvas } = this;
                    canvas.height = value;
                }
                screenToCanvas({ x, y }) {
                    const { canvas, width, height } = this, rect = canvas.getBoundingClientRect();
                    return { x: (x - rect.left) * (width / rect.width), y: (y - rect.top) * (height / rect.height) };
                }
                canvasToScreen({ x, y }) {
                    const { canvas, width, height } = this, rect = canvas.getBoundingClientRect();
                    return { x: (x * (rect.width / width)) + rect.left, y: (y * (rect.height / height)) + rect.top };
                }
            };
            exports_1("default", Canvas);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NhbnZhcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUEsU0FBQTtnQkFDQyxZQUF1QyxNQUF5QjtvQkFBekIsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7Z0JBQUksQ0FBQztnQkFJckUsSUFBVyxLQUFLO29CQUNmLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQVcsS0FBSyxDQUFFLEtBQWE7b0JBQzlCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixDQUFDO2dCQUVELElBQVcsTUFBTTtvQkFDaEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsSUFBVyxNQUFNLENBQUUsS0FBYTtvQkFDL0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDeEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRU0sY0FBYyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUNyQyxJQUFJLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBRSxFQUFFLENBQUM7Z0JBQzFHLENBQUM7Z0JBRU0sY0FBYyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUNyQyxJQUFJLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFFLENBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFFLENBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFHLENBQUM7YUFDRCxDQUFBO2lDQUVjLE1BQU07UUFBQyxDQUFDIiwiZmlsZSI6ImNhbnZhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFic3RyYWN0IGNsYXNzIENhbnZhcyB7XHJcblx0cHJvdGVjdGVkIGNvbnN0cnVjdG9yKCBwdWJsaWMgcmVhZG9ubHkgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCApIHt9XHJcblxyXG5cdHB1YmxpYyBhYnN0cmFjdCBjbGVhcigpOiB2b2lkO1xyXG5cclxuXHRwdWJsaWMgZ2V0IHdpZHRoKCkge1xyXG5cdFx0Y29uc3QgeyBjYW52YXMgfSA9IHRoaXM7XHJcblx0XHRyZXR1cm4gY2FudmFzLndpZHRoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB3aWR0aCggdmFsdWU6IG51bWJlciApIHtcclxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSB0aGlzO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGNhbnZhcy5oZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGhlaWdodCggdmFsdWU6IG51bWJlciApIHtcclxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSB0aGlzO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNjcmVlblRvQ2FudmFzKCB7IHgsIHkgfTogUG9pbnQgKTogUG9pbnQge1xyXG5cdFx0Y29uc3QgeyBjYW52YXMsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMsXHJcblx0XHRcdHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRyZXR1cm4geyB4OiAoIHggLSByZWN0LmxlZnQgKSAqICggd2lkdGggLyByZWN0LndpZHRoICksIHk6ICggeSAtIHJlY3QudG9wICkgKiAoIGhlaWdodCAvIHJlY3QuaGVpZ2h0ICkgfTsgXHJcblx0fVxyXG5cclxuXHRwdWJsaWMgY2FudmFzVG9TY3JlZW4oIHsgeCwgeSB9OiBQb2ludCApOiBQb2ludCB7XHJcblx0XHRjb25zdCB7IGNhbnZhcywgd2lkdGgsIGhlaWdodCB9ID0gdGhpcyxcclxuXHRcdFx0cmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHJldHVybiB7IHg6ICggeCAqICggcmVjdC53aWR0aCAvIHdpZHRoICkgKSArIHJlY3QubGVmdCwgeTogKCB5ICogKCByZWN0LmhlaWdodCAvIGhlaWdodCApICkgKyByZWN0LnRvcCB9OyBcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhbnZhczsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

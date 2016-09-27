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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NhbnZhcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUEsU0FBQTtnQkFDQyxZQUF1QyxNQUF5QjtvQkFBekIsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7Z0JBQUksQ0FBQztnQkFJckUsSUFBVyxLQUFLO29CQUNmLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQVcsS0FBSyxDQUFFLEtBQWE7b0JBQzlCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixDQUFDO2dCQUVELElBQVcsTUFBTTtvQkFDaEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsSUFBVyxNQUFNLENBQUUsS0FBYTtvQkFDL0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDeEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRU0sY0FBYyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUNyQyxJQUFJLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBRSxFQUFFLENBQUM7Z0JBQzFHLENBQUM7Z0JBRU0sY0FBYyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUNyQyxJQUFJLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFFLENBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFFLENBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFHLENBQUM7YUFDRCxDQUFBO2lDQUVjLE1BQU07UUFDckIsQ0FBQyIsImZpbGUiOiJjYW52YXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhYnN0cmFjdCBjbGFzcyBDYW52YXMge1xyXG5cdHByb3RlY3RlZCBjb25zdHJ1Y3RvciggcHVibGljIHJlYWRvbmx5IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgKSB7fVxyXG5cclxuXHRwdWJsaWMgYWJzdHJhY3QgY2xlYXIoKTogdm9pZDtcclxuXHJcblx0cHVibGljIGdldCB3aWR0aCgpIHtcclxuXHRcdGNvbnN0IHsgY2FudmFzIH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGNhbnZhcy53aWR0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgd2lkdGgoIHZhbHVlOiBudW1iZXIgKSB7XHJcblx0XHRjb25zdCB7IGNhbnZhcyB9ID0gdGhpcztcclxuXHRcdGNhbnZhcy53aWR0aCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBoZWlnaHQoKSB7XHJcblx0XHRjb25zdCB7IGNhbnZhcyB9ID0gdGhpcztcclxuXHRcdHJldHVybiBjYW52YXMuaGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBoZWlnaHQoIHZhbHVlOiBudW1iZXIgKSB7XHJcblx0XHRjb25zdCB7IGNhbnZhcyB9ID0gdGhpcztcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzY3JlZW5Ub0NhbnZhcyggeyB4LCB5IH06IFBvaW50ICk6IFBvaW50IHtcclxuXHRcdGNvbnN0IHsgY2FudmFzLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLFxyXG5cdFx0XHRyZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0cmV0dXJuIHsgeDogKCB4IC0gcmVjdC5sZWZ0ICkgKiAoIHdpZHRoIC8gcmVjdC53aWR0aCApLCB5OiAoIHkgLSByZWN0LnRvcCApICogKCBoZWlnaHQgLyByZWN0LmhlaWdodCApIH07IFxyXG5cdH1cclxuXHJcblx0cHVibGljIGNhbnZhc1RvU2NyZWVuKCB7IHgsIHkgfTogUG9pbnQgKTogUG9pbnQge1xyXG5cdFx0Y29uc3QgeyBjYW52YXMsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMsXHJcblx0XHRcdHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRyZXR1cm4geyB4OiAoIHggKiAoIHJlY3Qud2lkdGggLyB3aWR0aCApICkgKyByZWN0LmxlZnQsIHk6ICggeSAqICggcmVjdC5oZWlnaHQgLyBoZWlnaHQgKSApICsgcmVjdC50b3AgfTsgXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYW52YXM7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

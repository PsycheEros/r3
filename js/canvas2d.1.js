System.register(["./canvas"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var canvas_1, Canvas2D;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            Canvas2D = class Canvas2D extends canvas_1.default {
                constructor(canvas) {
                    super(canvas);
                    this.c2d = canvas.getContext('2d');
                }
                clear() {
                    const { c2d, width, height } = this;
                    c2d.clearRect(0, 0, width, height);
                }
            };
            exports_1("default", Canvas2D);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NhbnZhczJkLjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFFQSxXQUFBLGNBQThCLFNBQVEsZ0JBQU07Z0JBQzNDLFlBQW9CLE1BQXlCO29CQUM1QyxLQUFLLENBQUUsTUFBTSxDQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUcsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSxLQUFLO29CQUNYLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQztnQkFDdEMsQ0FBQzthQUdELENBQUE7O1FBQUEsQ0FBQyIsImZpbGUiOiJjYW52YXMyZC4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMyRCBleHRlbmRzIENhbnZhcyB7XHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ICkge1xyXG5cdFx0c3VwZXIoIGNhbnZhcyApO1xyXG5cdFx0dGhpcy5jMmQgPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApITtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBjbGVhcigpIHtcclxuXHRcdGNvbnN0IHsgYzJkLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xyXG5cdFx0YzJkLmNsZWFyUmVjdCggMCwgMCwgd2lkdGgsIGhlaWdodCApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlYWRvbmx5IGMyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NhbnZhczJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBRUEsV0FBQSxjQUE4QixTQUFRLGdCQUFNO2dCQUMzQyxZQUFvQixNQUF5QjtvQkFDNUMsS0FBSyxDQUFFLE1BQU0sQ0FBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFHLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRU0sS0FBSztvQkFDWCxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxTQUFTLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQ3RDLENBQUM7YUFHRCxDQUFBOztRQUNELENBQUMiLCJmaWxlIjoiY2FudmFzMmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhczJEIGV4dGVuZHMgQ2FudmFzIHtcclxuXHRwdWJsaWMgY29uc3RydWN0b3IoIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgKSB7XHJcblx0XHRzdXBlciggY2FudmFzICk7XHJcblx0XHR0aGlzLmMyZCA9IGNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICkhO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGNsZWFyKCkge1xyXG5cdFx0Y29uc3QgeyBjMmQsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XHJcblx0XHRjMmQuY2xlYXJSZWN0KCAwLCAwLCB3aWR0aCwgaGVpZ2h0ICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVhZG9ubHkgYzJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbn1cclxuIl19

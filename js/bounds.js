System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Bounds;
    return {
        setters: [],
        execute: function () {
            Bounds = class Bounds {
                constructor(left, top, width, height) {
                    this.left = left;
                    this.top = top;
                    this.width = width;
                    this.height = height;
                }
                get bottom() {
                    const { top, height } = this;
                    return top + height;
                }
                get right() {
                    const { left, width } = this;
                    return left + width;
                }
                hitTest({ x, y }) {
                    const { top, right, bottom, left } = this;
                    return x >= left && x <= right
                        && y >= top && y <= bottom;
                }
            };
            exports_1("default", Bounds);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2JvdW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUEsU0FBQTtnQkFDQyxZQUFvQyxJQUFZLEVBQWtCLEdBQVcsRUFBa0IsS0FBYSxFQUFrQixNQUFjO29CQUF4RyxTQUFJLEdBQUosSUFBSSxDQUFRO29CQUFrQixRQUFHLEdBQUgsR0FBRyxDQUFRO29CQUFrQixVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFrQixXQUFNLEdBQU4sTUFBTSxDQUFRO2dCQUFJLENBQUM7Z0JBRWpKLElBQVcsTUFBTTtvQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQVcsS0FBSztvQkFDZixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDN0IsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sT0FBTyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDOUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDMUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUs7MkJBQzFCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQztnQkFDN0IsQ0FBQzthQUNELENBQUE7O1FBQUEsQ0FBQyIsImZpbGUiOiJib3VuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBCb3VuZHMge1xuXHRwdWJsaWMgY29uc3RydWN0b3IoIHB1YmxpYyByZWFkb25seSBsZWZ0OiBudW1iZXIsIHB1YmxpYyByZWFkb25seSB0b3A6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlciApIHt9XG5cblx0cHVibGljIGdldCBib3R0b20oKSB7XG5cdFx0Y29uc3QgeyB0b3AsIGhlaWdodCB9ID0gdGhpcztcblx0XHRyZXR1cm4gdG9wICsgaGVpZ2h0O1xuXHR9XG5cblx0cHVibGljIGdldCByaWdodCgpIHtcblx0XHRjb25zdCB7IGxlZnQsIHdpZHRoIH0gPSB0aGlzO1xuXHRcdHJldHVybiBsZWZ0ICsgd2lkdGg7XG5cdH1cblxuXHRwdWJsaWMgaGl0VGVzdCggeyB4LCB5IH06IFBvaW50ICkge1xuXHRcdGNvbnN0IHsgdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0IH0gPSB0aGlzO1xuXHRcdHJldHVybiB4ID49IGxlZnQgJiYgeCA8PSByaWdodFxuXHRcdFx0JiYgeSA+PSB0b3AgJiYgeSA8PSBib3R0b207XG5cdH1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

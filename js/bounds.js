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
                get center() {
                    const { left, top, width, height } = this, x = left + width * .5, y = top + height * .5;
                    return { x, y };
                }
                get n() {
                    const { left, top, width } = this, x = left + width * .5, y = top;
                    return { x, y };
                }
                get ne() {
                    const { left, top, width } = this, x = left + width, y = top;
                    return { x, y };
                }
                get e() {
                    const { left, top, width, height } = this, x = left + width, y = top + height * .5;
                    return { x, y };
                }
                get se() {
                    const { left, top, width, height } = this, x = left + width, y = top + height;
                    return { x, y };
                }
                get s() {
                    const { left, top, width, height } = this, x = left + width * .5, y = top + height;
                    return { x, y };
                }
                get sw() {
                    const { left, top, height } = this, x = left, y = top + height;
                    return { x, y };
                }
                get w() {
                    const { left, top, height } = this, x = left, y = top + height * .5;
                    return { x, y };
                }
                get nw() {
                    const { left, top } = this, x = left, y = top;
                    return { x, y };
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2JvdW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUEsU0FBQTtnQkFDQyxZQUFvQyxJQUFZLEVBQWtCLEdBQVcsRUFBa0IsS0FBYSxFQUFrQixNQUFjO29CQUF4RyxTQUFJLEdBQUosSUFBSSxDQUFRO29CQUFrQixRQUFHLEdBQUgsR0FBRyxDQUFRO29CQUFrQixVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFrQixXQUFNLEdBQU4sTUFBTSxDQUFRO2dCQUFJLENBQUM7Z0JBRWpKLElBQVcsTUFBTTtvQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQVcsS0FBSztvQkFDZixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDN0IsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQsSUFBVyxNQUFNO29CQUNoQixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUN4QyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFLEVBQ3JCLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDdkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQ2hDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUUsRUFDckIsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDVCxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRUQsSUFBVyxFQUFFO29CQUNaLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksRUFDaEMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLEVBQ2hCLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUN4QyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDaEIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRUQsSUFBVyxFQUFFO29CQUNaLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQ3hDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUNoQixDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztvQkFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUN4QyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFLEVBQ3JCLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO29CQUNsQixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRUQsSUFBVyxFQUFFO29CQUNaLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFDakMsQ0FBQyxHQUFHLElBQUksRUFDUixDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztvQkFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQ2pDLENBQUMsR0FBRyxJQUFJLEVBQ1IsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRUQsSUFBVyxFQUFFO29CQUNaLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUN6QixDQUFDLEdBQUcsSUFBSSxFQUNSLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVNLE9BQU8sQ0FBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQVM7b0JBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLOzJCQUMxQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUM7Z0JBQzdCLENBQUM7YUFDRCxDQUFBOztRQUNELENBQUMiLCJmaWxlIjoiYm91bmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm91bmRzIHtcclxuXHRwdWJsaWMgY29uc3RydWN0b3IoIHB1YmxpYyByZWFkb25seSBsZWZ0OiBudW1iZXIsIHB1YmxpYyByZWFkb25seSB0b3A6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlciApIHt9XHJcblxyXG5cdHB1YmxpYyBnZXQgYm90dG9tKCkge1xyXG5cdFx0Y29uc3QgeyB0b3AsIGhlaWdodCB9ID0gdGhpcztcclxuXHRcdHJldHVybiB0b3AgKyBoZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHJpZ2h0KCkge1xyXG5cdFx0Y29uc3QgeyBsZWZ0LCB3aWR0aCB9ID0gdGhpcztcclxuXHRcdHJldHVybiBsZWZ0ICsgd2lkdGg7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGNlbnRlcigpIHtcclxuXHRcdGNvbnN0IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLFxyXG5cdFx0XHR4ID0gbGVmdCArIHdpZHRoICogLjUsXHJcblx0XHRcdHkgPSB0b3AgKyBoZWlnaHQgKiAuNTtcclxuXHRcdHJldHVybiB7IHgsIHkgfTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbigpIHtcclxuXHRcdGNvbnN0IHsgbGVmdCwgdG9wLCB3aWR0aCB9ID0gdGhpcyxcclxuXHRcdFx0eCA9IGxlZnQgKyB3aWR0aCAqIC41LFxyXG5cdFx0XHR5ID0gdG9wO1xyXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBuZSgpIHtcclxuXHRcdGNvbnN0IHsgbGVmdCwgdG9wLCB3aWR0aCB9ID0gdGhpcyxcclxuXHRcdFx0eCA9IGxlZnQgKyB3aWR0aCxcclxuXHRcdFx0eSA9IHRvcDtcclxuXHRcdHJldHVybiB7IHgsIHkgfTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZSgpIHtcclxuXHRcdGNvbnN0IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLFxyXG5cdFx0XHR4ID0gbGVmdCArIHdpZHRoLFxyXG5cdFx0XHR5ID0gdG9wICsgaGVpZ2h0ICogLjU7XHJcblx0XHRyZXR1cm4geyB4LCB5IH07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHNlKCkge1xyXG5cdFx0Y29uc3QgeyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMsXHJcblx0XHRcdHggPSBsZWZ0ICsgd2lkdGgsXHJcblx0XHRcdHkgPSB0b3AgKyBoZWlnaHQ7XHJcblx0XHRyZXR1cm4geyB4LCB5IH07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHMoKSB7XHJcblx0XHRjb25zdCB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcyxcclxuXHRcdFx0eCA9IGxlZnQgKyB3aWR0aCAqIC41LFxyXG5cdFx0XHR5ID0gdG9wICsgaGVpZ2h0O1xyXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzdygpIHtcclxuXHRcdGNvbnN0IHsgbGVmdCwgdG9wLCBoZWlnaHQgfSA9IHRoaXMsXHJcblx0XHRcdHggPSBsZWZ0LFxyXG5cdFx0XHR5ID0gdG9wICsgaGVpZ2h0O1xyXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB3KCkge1xyXG5cdFx0Y29uc3QgeyBsZWZ0LCB0b3AsIGhlaWdodCB9ID0gdGhpcyxcclxuXHRcdFx0eCA9IGxlZnQsXHJcblx0XHRcdHkgPSB0b3AgKyBoZWlnaHQgKiAuNTtcclxuXHRcdHJldHVybiB7IHgsIHkgfTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbncoKSB7XHJcblx0XHRjb25zdCB7IGxlZnQsIHRvcCB9ID0gdGhpcyxcclxuXHRcdFx0eCA9IGxlZnQsXHJcblx0XHRcdHkgPSB0b3A7XHJcblx0XHRyZXR1cm4geyB4LCB5IH07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaGl0VGVzdCggeyB4LCB5IH06IFBvaW50ICkge1xyXG5cdFx0Y29uc3QgeyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQgfSA9IHRoaXM7XHJcblx0XHRyZXR1cm4geCA+PSBsZWZ0ICYmIHggPD0gcmlnaHRcclxuXHRcdFx0JiYgeSA+PSB0b3AgJiYgeSA8PSBib3R0b207XHJcblx0fVxyXG59XHJcbiJdfQ==

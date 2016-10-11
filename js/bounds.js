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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2JvdW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBQUEsU0FBQTtnQkFDQyxZQUFvQyxJQUFZLEVBQWtCLEdBQVcsRUFBa0IsS0FBYSxFQUFrQixNQUFjO29CQUF4RyxTQUFJLEdBQUosSUFBSSxDQUFRO29CQUFrQixRQUFHLEdBQUgsR0FBRyxDQUFRO29CQUFrQixVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFrQixXQUFNLEdBQU4sTUFBTSxDQUFRO2dCQUFJLENBQUM7Z0JBRWpKLElBQVcsTUFBTTtvQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQVcsS0FBSztvQkFDZixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDN0IsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sT0FBTyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUztvQkFDOUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDMUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUs7MkJBQzFCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQztnQkFDN0IsQ0FBQzthQUNELENBQUE7O1FBQUEsQ0FBQyIsImZpbGUiOiJib3VuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBCb3VuZHMge1xyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvciggcHVibGljIHJlYWRvbmx5IGxlZnQ6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IHRvcDogbnVtYmVyLCBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyICkge31cclxuXHJcblx0cHVibGljIGdldCBib3R0b20oKSB7XHJcblx0XHRjb25zdCB7IHRvcCwgaGVpZ2h0IH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHRvcCArIGhlaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgcmlnaHQoKSB7XHJcblx0XHRjb25zdCB7IGxlZnQsIHdpZHRoIH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGxlZnQgKyB3aWR0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBoaXRUZXN0KCB7IHgsIHkgfTogUG9pbnQgKSB7XHJcblx0XHRjb25zdCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCB9ID0gdGhpcztcclxuXHRcdHJldHVybiB4ID49IGxlZnQgJiYgeCA8PSByaWdodFxyXG5cdFx0XHQmJiB5ID49IHRvcCAmJiB5IDw9IGJvdHRvbTtcclxuXHR9XHJcbn0iXX0=

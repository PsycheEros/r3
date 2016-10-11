System.register(["./grid", "./bounds", "./square"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var grid_1, bounds_1, square_1, Board;
    return {
        setters: [
            function (grid_1_1) {
                grid_1 = grid_1_1;
            },
            function (bounds_1_1) {
                bounds_1 = bounds_1_1;
            },
            function (square_1_1) {
                square_1 = square_1_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor(width, height) {
                    this.reset(width, height);
                }
                reset(width, height) {
                    const grid = this.grid = new grid_1.default(width, height), squareSize = { width: 64, height: 64 }, gutterSize = { width: 4, height: 4 };
                    for (let x = 0; x < width; ++x)
                        for (let y = 0; y < height; ++y) {
                            const position = { x, y }, bounds = new bounds_1.default(x * (squareSize.width + gutterSize.width), y * (squareSize.height + gutterSize.height), squareSize.width, squareSize.height);
                            grid.set({ x, y }, new square_1.default(position, bounds));
                        }
                }
                get(point) {
                    const { grid } = this;
                    return grid.get(point);
                }
                [Symbol.iterator]() {
                    const { grid } = this;
                    return grid[Symbol.iterator]();
                }
                hitTest(pt) {
                    for (const square of this) {
                        if (square.bounds.hitTest(pt)) {
                            return square;
                        }
                    }
                    return null;
                }
            };
            exports_1("default", Board);
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2JvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSUEsUUFBQTtnQkFDQyxZQUFvQixLQUFhLEVBQUUsTUFBYztvQkFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU0sS0FBSyxDQUFFLEtBQWEsRUFBRSxNQUFjO29CQUMxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFVLEtBQUssRUFBRSxNQUFNLENBQUUsRUFDekQsVUFBVSxHQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQzVDLFVBQVUsR0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUM1QyxHQUFHLENBQUEsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUM7d0JBQzlCLEdBQUcsQ0FBQSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFHLENBQUM7NEJBQ2xDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUN4QixNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUNsQixDQUFDLEdBQUcsQ0FBRSxVQUFVLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUUsRUFDM0MsQ0FBQyxHQUFHLENBQUUsVUFBVSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFFLEVBQzdDLFVBQVUsQ0FBQyxLQUFLLEVBQ2hCLFVBQVUsQ0FBQyxNQUFNLENBQ2pCLENBQUM7NEJBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLGdCQUFNLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQUFFLENBQUM7d0JBQ3RELENBQUM7Z0JBQ0YsQ0FBQztnQkFFTSxHQUFHLENBQUUsS0FBWTtvQkFDdkIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFHLENBQUM7Z0JBQzNCLENBQUM7Z0JBRU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUN2QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUN0QixNQUFNLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUUsRUFBOEIsQ0FBQztnQkFDOUQsQ0FBQztnQkFFTSxPQUFPLENBQUUsRUFBUztvQkFDeEIsR0FBRyxDQUFBLENBQUUsTUFBTSxNQUFNLElBQUksSUFBSyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsRUFBRSxDQUFBLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUUsRUFBRSxDQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDO3dCQUNmLENBQUM7b0JBQ0YsQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNiLENBQUM7YUFHRCxDQUFBOztRQUNELENBQUMiLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xyXG5pbXBvcnQgQm91bmRzIGZyb20gJy4vYm91bmRzJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuL3NxdWFyZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2FyZCB7XHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciApIHtcclxuXHRcdHRoaXMucmVzZXQoIHdpZHRoLCBoZWlnaHQgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZXNldCggd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgKSB7XHJcblx0XHRjb25zdCBncmlkID0gdGhpcy5ncmlkID0gbmV3IEdyaWQ8U3F1YXJlPiggd2lkdGgsIGhlaWdodCApLFxyXG5cdFx0XHRzcXVhcmVTaXplOiBTaXplID0geyB3aWR0aDogNjQsIGhlaWdodDogNjQgfSxcclxuXHRcdFx0Z3V0dGVyU2l6ZTogU2l6ZSA9IHsgd2lkdGg6IDQsIGhlaWdodDogNCB9O1xyXG5cdFx0Zm9yKCBsZXQgeCA9IDA7IHggPCB3aWR0aDsgKyt4IClcclxuXHRcdGZvciggbGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyArK3kgKSB7XHJcblx0XHRcdGNvbnN0IHBvc2l0aW9uID0geyB4LCB5IH0sXHJcblx0XHRcdFx0Ym91bmRzID0gbmV3IEJvdW5kcyhcclxuXHRcdFx0XHRcdHggKiAoIHNxdWFyZVNpemUud2lkdGggKyBndXR0ZXJTaXplLndpZHRoICksXHJcblx0XHRcdFx0XHR5ICogKCBzcXVhcmVTaXplLmhlaWdodCArIGd1dHRlclNpemUuaGVpZ2h0ICksXHJcblx0XHRcdFx0XHRzcXVhcmVTaXplLndpZHRoLFxyXG5cdFx0XHRcdFx0c3F1YXJlU2l6ZS5oZWlnaHRcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRncmlkLnNldCggeyB4LCB5IH0sIG5ldyBTcXVhcmUoIHBvc2l0aW9uLCBib3VuZHMgKSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCggcG9pbnQ6IFBvaW50ICkge1xyXG5cdFx0Y29uc3QgeyBncmlkIH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGdyaWQuZ2V0KCBwb2ludCApITtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuXHRcdGNvbnN0IHsgZ3JpZCB9ID0gdGhpcztcclxuXHRcdHJldHVybiBncmlkWyBTeW1ib2wuaXRlcmF0b3IgXSgpIGFzIEl0ZXJhYmxlSXRlcmF0b3I8U3F1YXJlPjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBoaXRUZXN0KCBwdDogUG9pbnQgKTogU3F1YXJlfG51bGwge1xyXG5cdFx0Zm9yKCBjb25zdCBzcXVhcmUgb2YgdGhpcyApIHtcclxuXHRcdFx0aWYoIHNxdWFyZS5ib3VuZHMuaGl0VGVzdCggcHQgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gc3F1YXJlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ3JpZDogR3JpZDxTcXVhcmU+O1xyXG59XHJcbiJdfQ==

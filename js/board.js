System.register(["./grid"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var grid_1, Board;
    return {
        setters: [
            function (grid_1_1) {
                grid_1 = grid_1_1;
            }
        ],
        execute: function () {
            Board = class Board {
                constructor(width, height) {
                    this.reset(width, height);
                }
                reset(width, height) {
                    const grid = this.grid = new grid_1.default(width, height);
                    for (let x = 0; x < width; ++x)
                        for (let y = 0; y < height; ++y) {
                            grid.set({ x, y }, { x, y, enabled: true, color: null });
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
            };
            exports_1("default", Board);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2JvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBRUEsUUFBQTtnQkFDQyxZQUFvQixLQUFhLEVBQUUsTUFBYztvQkFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU0sS0FBSyxDQUFFLEtBQWEsRUFBRSxNQUFjO29CQUMxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFVLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQztvQkFDM0QsR0FBRyxDQUFBLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDO3dCQUM5QixHQUFHLENBQUEsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRyxDQUFDOzRCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBRSxDQUFDO3dCQUM1RCxDQUFDO2dCQUNGLENBQUM7Z0JBRU0sR0FBRyxDQUFFLEtBQVk7b0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBRyxDQUFDO2dCQUMzQixDQUFDO2dCQUVNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsUUFBUSxDQUFFLEVBQThCLENBQUM7Z0JBQzlELENBQUM7YUFHRCxDQUFBOztRQUNELENBQUMiLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9hcmQge1xyXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvciggd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgKSB7XHJcblx0XHR0aGlzLnJlc2V0KCB3aWR0aCwgaGVpZ2h0ICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVzZXQoIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyICkge1xyXG5cdFx0Y29uc3QgZ3JpZCA9IHRoaXMuZ3JpZCA9IG5ldyBHcmlkPFNxdWFyZT4oIHdpZHRoLCBoZWlnaHQgKTtcclxuXHRcdGZvciggbGV0IHggPSAwOyB4IDwgd2lkdGg7ICsreCApXHJcblx0XHRmb3IoIGxldCB5ID0gMDsgeSA8IGhlaWdodDsgKyt5ICkge1xyXG5cdFx0XHRncmlkLnNldCggeyB4LCB5IH0sIHsgeCwgeSwgZW5hYmxlZDogdHJ1ZSwgY29sb3I6IG51bGwgfSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCggcG9pbnQ6IFBvaW50ICkge1xyXG5cdFx0Y29uc3QgeyBncmlkIH0gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGdyaWQuZ2V0KCBwb2ludCApITtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuXHRcdGNvbnN0IHsgZ3JpZCB9ID0gdGhpcztcclxuXHRcdHJldHVybiBncmlkWyBTeW1ib2wuaXRlcmF0b3IgXSgpIGFzIEl0ZXJhYmxlSXRlcmF0b3I8U3F1YXJlPjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ3JpZDogR3JpZDxTcXVhcmU+O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

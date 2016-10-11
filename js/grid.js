System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Grid;
    return {
        setters: [],
        execute: function () {
            Grid = class Grid {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                    this.data = new Map();
                }
                get({ x, y }) {
                    this.validate(x, y);
                    const key = JSON.stringify({ x, y });
                    return this.data.get(key);
                }
                set({ x, y }, value) {
                    this.validate(x, y);
                    const key = JSON.stringify({ x, y });
                    this.data.set(key, value);
                }
                validate(x, y) {
                    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
                        throw new Error(`(${x}, ${y}) is not valid`);
                    }
                    const { width, height } = this;
                    if (x < 0 || x > width || y < 0 || y > height) {
                        throw new Error(`(${x}, ${y}) is out of bounds`);
                    }
                }
                [Symbol.iterator]() {
                    function* iterator() {
                        const { width, height } = this;
                        for (let x = 0; x < width; ++x)
                            for (let y = 0; y < height; ++y) {
                                yield this.get({ x, y });
                            }
                    }
                    return iterator.call(this);
                }
            };
            exports_1("default", Grid);
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2dyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQUFBLE9BQUE7Z0JBQ0MsWUFBb0MsS0FBYSxFQUFrQixNQUFjO29CQUE3QyxVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFrQixXQUFNLEdBQU4sTUFBTSxDQUFRO29CQW1DekUsU0FBSSxHQUFHLElBQUksR0FBRyxFQUFhLENBQUM7Z0JBbkNpRCxDQUFDO2dCQUUvRSxHQUFHLENBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFTO29CQUMxQixJQUFJLENBQUMsUUFBUSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztvQkFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDO29CQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU0sR0FBRyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBUyxFQUFFLEtBQVE7b0JBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO29CQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRSxLQUFLLENBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFFTyxRQUFRLENBQUUsQ0FBUyxFQUFFLENBQVM7b0JBQ3JDLEVBQUUsQ0FBQSxDQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBRSxDQUFDLENBQUUsSUFBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUUsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxNQUFNLElBQUksS0FBSyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUUsQ0FBQztvQkFDaEQsQ0FBQztvQkFDRCxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDL0IsRUFBRSxDQUFBLENBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ2hELE1BQU0sSUFBSSxLQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBRSxDQUFDO29CQUNwRCxDQUFDO2dCQUNGLENBQUM7Z0JBRU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUN2Qjt3QkFDQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQzt3QkFDL0IsR0FBRyxDQUFBLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDOzRCQUM5QixHQUFHLENBQUEsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFHLENBQUMsRUFBRyxDQUFDO2dDQUNuQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQzs0QkFDNUIsQ0FBQztvQkFDRixDQUFDO29CQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBbUMsQ0FBQztnQkFDL0QsQ0FBQzthQUdELENBQUE7O1FBQ0QsQ0FBQyIsImZpbGUiOiJncmlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZDxUPiB7XHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyICkge31cclxuXHJcblx0cHVibGljIGdldCggeyB4LCB5IH06IFBvaW50ICkge1xyXG5cdFx0dGhpcy52YWxpZGF0ZSggeCwgeSApO1xyXG5cdFx0Y29uc3Qga2V5ID0gSlNPTi5zdHJpbmdpZnkoIHsgeCwgeSB9ICk7XHJcblx0XHRyZXR1cm4gdGhpcy5kYXRhLmdldCgga2V5ICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0KCB7IHgsIHkgfTogUG9pbnQsIHZhbHVlOiBUICkge1xyXG5cdFx0dGhpcy52YWxpZGF0ZSggeCwgeSApO1xyXG5cdFx0Y29uc3Qga2V5ID0gSlNPTi5zdHJpbmdpZnkoIHsgeCwgeSB9ICk7XHJcblx0XHR0aGlzLmRhdGEuc2V0KCBrZXksIHZhbHVlICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHZhbGlkYXRlKCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcclxuXHRcdGlmKCAhTnVtYmVyLmlzU2FmZUludGVnZXIoIHggKSAgfHwgIU51bWJlci5pc1NhZmVJbnRlZ2VyKCB5ICkgKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvciggYCgke3h9LCAke3l9KSBpcyBub3QgdmFsaWRgICk7XHJcblx0XHR9XHJcblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XHJcblx0XHRpZiggeCA8IDAgfHwgeCA+IHdpZHRoIHx8IHkgPCAwIHx8IHkgPiBoZWlnaHQgKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvciggYCgke3h9LCAke3l9KSBpcyBvdXQgb2YgYm91bmRzYCApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG5cdFx0ZnVuY3Rpb24gKml0ZXJhdG9yKCB0aGlzOiBHcmlkPFQ+ICkge1xyXG5cdFx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XHJcblx0XHRcdGZvciggbGV0IHggPSAwOyB4IDwgd2lkdGg7ICsreCApXHJcblx0XHRcdGZvciggbGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyArKyB5ICkge1xyXG5cdFx0XHRcdHlpZWxkIHRoaXMuZ2V0KCB7IHgsIHkgfSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaXRlcmF0b3IuY2FsbCggdGhpcyApIGFzIEl0ZXJhYmxlSXRlcmF0b3I8VHx1bmRlZmluZWQ+O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBkYXRhID0gbmV3IE1hcDxzdHJpbmcsIFQ+KCk7XHJcbn1cclxuIl19

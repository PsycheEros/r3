System.register(["./canvas"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var canvas_1, Canvas3D;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            Canvas3D = class Canvas3D extends canvas_1.default {
                constructor(canvas) {
                    super(canvas);
                    this.gl = canvas.getContext('webgl');
                }
                clear() {
                    const { gl } = this;
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                }
            };
            exports_1("default", Canvas3D);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NhbnZhczNkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBRUEsV0FBQSxjQUE4QixTQUFRLGdCQUFNO2dCQUMzQyxZQUFvQixNQUF5QjtvQkFDNUMsS0FBSyxDQUFFLE1BQU0sQ0FBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFHLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRU0sS0FBSztvQkFDWCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUNwQixFQUFFLENBQUMsS0FBSyxDQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUUsQ0FBQztnQkFDdkQsQ0FBQzthQUdELENBQUE7O1FBQ0QsQ0FBQyIsImZpbGUiOiJjYW52YXMzZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMgZnJvbSAnLi9jYW52YXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzM0QgZXh0ZW5kcyBDYW52YXMge1xyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvciggY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCApIHtcclxuXHRcdHN1cGVyKCBjYW52YXMgKTtcclxuXHRcdHRoaXMuZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCggJ3dlYmdsJyApITtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBjbGVhcigpIHtcclxuXHRcdGNvbnN0IHsgZ2wgfSA9IHRoaXM7XHJcblx0XHRnbC5jbGVhciggZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

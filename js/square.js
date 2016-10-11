System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Square;
    return {
        setters: [],
        execute: function () {
            Square = class Square {
                constructor(position, bounds) {
                    this.position = position;
                    this.bounds = bounds;
                    this.enabled = true;
                    this.color = null;
                }
                get empty() { return this.color === null; }
            };
            exports_1("default", Square);
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL3NxdWFyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBRUEsU0FBQTtnQkFDQyxZQUFvQyxRQUFlLEVBQWtCLE1BQWM7b0JBQS9DLGFBQVEsR0FBUixRQUFRLENBQU87b0JBQWtCLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBRTVFLFlBQU8sR0FBRyxJQUFJLENBQUM7b0JBQ2YsVUFBSyxHQUFnQixJQUFJLENBQUM7Z0JBSHNELENBQUM7Z0JBS3hGLElBQVcsS0FBSyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDbEQsQ0FBQTs7UUFDRCxDQUFDIiwiZmlsZSI6InNxdWFyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb3VuZHMgZnJvbSAnLi9ib3VuZHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIHtcclxuXHRwdWJsaWMgY29uc3RydWN0b3IoIHB1YmxpYyByZWFkb25seSBwb3NpdGlvbjogUG9pbnQsIHB1YmxpYyByZWFkb25seSBib3VuZHM6IEJvdW5kcyApIHt9XHJcblxyXG5cdHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuXHRwdWJsaWMgY29sb3I6IG51bWJlcnxudWxsID0gbnVsbDtcclxuXHJcblx0cHVibGljIGdldCBlbXB0eSgpIHsgcmV0dXJuIHRoaXMuY29sb3IgPT09IG51bGw7IH1cclxufVxyXG4iXX0=

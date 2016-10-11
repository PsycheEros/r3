System.register([], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments)).next());
        });
    };
    var __moduleName = context_1 && context_1.id;
    function loadText(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest;
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                const { status, statusText } = xhr;
                if (!/^2/.test(String(status))) {
                    reject(new Error(`${status} ${statusText}: ${url}`));
                    return;
                }
                resolve(xhr.responseText);
            };
            xhr.onerror = () => { reject(`Failed to load ${url}`); };
            xhr.open('GET', url);
            xhr.send(null);
        });
    }
    function loadJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield loadText(url));
        });
    }
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image;
            img.onload = () => { resolve(img); };
            img.onerror = () => { reject(new Error(`Failed to load ${url}`)); };
            img.src = url;
        });
    }
    exports_1("loadText", loadText);
    exports_1("loadJson", loadJson);
    exports_1("loadImage", loadImage);
    return {
        setters: [],
        execute: function () {
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2xvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxrQkFBMEIsR0FBVztRQUNwQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVUsQ0FBRSxPQUFPLEVBQUUsTUFBTTtZQUM1QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsQ0FBQztZQUMvQixHQUFHLENBQUMsa0JBQWtCLEdBQUc7Z0JBQ3hCLEVBQUUsQ0FBQSxDQUFFLEdBQUcsQ0FBQyxVQUFVLEtBQUssQ0FBRSxDQUFDLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQUMsQ0FBQztnQkFDdEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sQ0FBRSxJQUFJLEtBQUssQ0FBRSxHQUFHLE1BQU0sSUFBSSxVQUFVLEtBQUssR0FBRyxFQUFFLENBQUUsQ0FBRSxDQUFDO29CQUN6RCxNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFDRCxPQUFPLENBQUUsR0FBRyxDQUFDLFlBQVksQ0FBRSxDQUFDO1lBQzdCLENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxPQUFPLEdBQUcsUUFBUSxNQUFNLENBQUUsa0JBQWtCLEdBQUcsRUFBRSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsR0FBRyxDQUFDLElBQUksQ0FBRSxLQUFLLEVBQUUsR0FBRyxDQUFFLENBQUM7WUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUNsQixDQUFDLENBQUUsQ0FBQztJQUNMLENBQUM7SUFFRCxrQkFBZ0MsR0FBVzs7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUUsTUFBTSxRQUFRLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFRCxtQkFBMkIsR0FBVztRQUNyQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQW9CLENBQUUsT0FBTyxFQUFFLE1BQU07WUFDdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUM7WUFDdEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLE9BQU8sQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsT0FBTyxHQUFHLFFBQVEsTUFBTSxDQUFFLElBQUksS0FBSyxDQUFFLGtCQUFrQixHQUFHLEVBQUUsQ0FBRSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUUsQ0FBQztJQUNMLENBQUM7Ozs7Ozs7UUFDRCxDQUFDIiwiZmlsZSI6ImxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbG9hZFRleHQoIHVybDogc3RyaW5nICkge1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcclxuXHRcdGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGlmKCB4aHIucmVhZHlTdGF0ZSAhPT0gNCApIHsgcmV0dXJuOyB9XHJcblx0XHRcdGNvbnN0IHsgc3RhdHVzLCBzdGF0dXNUZXh0IH0gPSB4aHI7XHJcblx0XHRcdGlmKCAhL14yLy50ZXN0KCBTdHJpbmcoIHN0YXR1cyApICkgKSB7XHJcblx0XHRcdFx0cmVqZWN0KCBuZXcgRXJyb3IoIGAke3N0YXR1c30gJHtzdGF0dXNUZXh0fTogJHt1cmx9YCApICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc29sdmUoIHhoci5yZXNwb25zZVRleHQgKTtcclxuXHRcdH07XHJcblx0XHR4aHIub25lcnJvciA9ICgpID0+IHsgcmVqZWN0KCBgRmFpbGVkIHRvIGxvYWQgJHt1cmx9YCApOyB9O1xyXG5cdFx0eGhyLm9wZW4oICdHRVQnLCB1cmwgKTtcclxuXHRcdHhoci5zZW5kKCBudWxsICk7XHJcblx0fSApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEpzb24oIHVybDogc3RyaW5nICkge1xyXG5cdHJldHVybiBKU09OLnBhcnNlKCBhd2FpdCBsb2FkVGV4dCggdXJsICkgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRJbWFnZSggdXJsOiBzdHJpbmcgKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcclxuXHRcdGNvbnN0IGltZyA9IG5ldyBJbWFnZTtcclxuXHRcdGltZy5vbmxvYWQgPSAoKSA9PiB7IHJlc29sdmUoIGltZyApOyB9O1xyXG5cdFx0aW1nLm9uZXJyb3IgPSAoKSA9PiB7IHJlamVjdCggbmV3IEVycm9yKCBgRmFpbGVkIHRvIGxvYWQgJHt1cmx9YCApICk7IH07XHJcblx0XHRpbWcuc3JjID0gdXJsO1xyXG5cdH0gKTtcclxufVxyXG4iXX0=

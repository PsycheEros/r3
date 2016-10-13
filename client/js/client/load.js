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

//# sourceMappingURL=load.js.map

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		"server": 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// require() chunk loading for javascript
/******/
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./" + ({"main~server":"main~server"}[chunkId]||chunkId) + ".js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// uncaught error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using import().catch()
/******/ 		});
/******/ 	};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/start.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/data/config.yaml":
/*!******************************!*\
  !*** ./src/data/config.yaml ***!
  \******************************/
/*! exports provided: workers, cspPolicy, connectionOptions, validation, appSettings, cleanup, redis, default */
/***/ (function(module) {

module.exports = {"workers":1,"cspPolicy":{"policy":{"directives":{"default-src":["self"],"script-src":["self"]},"reportPolicy":{"useScriptNonce":true,"useStyleNonce":true,"directives":{"default-src":["self"],"script-src":["self"],"plugin-types":[]}}}},"connectionOptions":{"type":"sqlite","database":":memory:","synchronize":true,"logging":["warn","error"]},"validation":{"maxNickLength":32,"maxRoomNameLength":64},"appSettings":{"case sensitive routing":true,"host":"0.0.0.0","json escape":true,"json spaces":"\\t","port":8080,"strict routing":true,"x-powered-by":false},"cleanup":{"rooms":{"checkSeconds":15,"expireSeconds":300}},"redis":{"url":"//localhost:6379","config":{"showFriendlyErrorStack":true}}};

/***/ }),

/***/ "./src/server/error-handler.ts":
/*!*************************************!*\
  !*** ./src/server/error-handler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


process.on('uncaughtException', err => {
  console.error(`${new Date().toUTCString()} uncaughtException: ${err}\n${err.stack}`);
  process.exit(1);
});
process.on('unhandledRejection', (err = {}) => {
  console.error(`${new Date().toUTCString()} unhandledRejection: ${err}\n${err.stack}`);
});

/***/ }),

/***/ "./src/server/polyfills.ts":
/*!*********************************!*\
  !*** ./src/server/polyfills.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

__webpack_require__(/*! reflect-metadata */ "reflect-metadata");

/***/ }),

/***/ "./src/server/rxjs.ts":
/*!****************************!*\
  !*** ./src/server/rxjs.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.fromNodeEvent = void 0;

var _rxjs = __webpack_require__(/*! rxjs */ "rxjs");

const fromNodeEvent = (target, event) => (0, _rxjs.fromEventPattern)(e => {
  target.addListener(event, e);
}, e => {
  target.removeListener(event, e);
});

exports.fromNodeEvent = fromNodeEvent;

/***/ }),

/***/ "./src/server/shut-down.ts":
/*!*********************************!*\
  !*** ./src/server/shut-down.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.shutDown = shutDown;
exports.shuttingDown = void 0;

var _rxjs = __webpack_require__(/*! rxjs */ "rxjs");

var _operators = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");

var _rxjs2 = __webpack_require__(/*! ./rxjs */ "./src/server/rxjs.ts");

var _cluster = _interopRequireDefault(__webpack_require__(/*! cluster */ "cluster"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _shuttingDown = new _rxjs.Subject();

const shuttingDown = _shuttingDown;
exports.shuttingDown = shuttingDown;

function shutDown() {
  _shuttingDown.next(true);

  _shuttingDown.complete();
}

(0, _rxjs.of)('SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM').pipe((0, _operators.mergeMap)(sig => (0, _rxjs2.fromNodeEvent)(process, sig).pipe((0, _operators.mapTo)(sig)))).subscribe(shutDown);

if (_cluster.default.isWorker) {
  (0, _rxjs2.fromNodeEvent)(_cluster.default, 'disconnect').pipe((0, _operators.take)(1)).subscribe(shutDown);
}

/***/ }),

/***/ "./src/server/start.ts":
/*!*****************************!*\
  !*** ./src/server/start.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./error-handler */ "./src/server/error-handler.ts");

__webpack_require__(/*! ./polyfills */ "./src/server/polyfills.ts");

var _operators = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");

var _rxjs = __webpack_require__(/*! ./rxjs */ "./src/server/rxjs.ts");

var _shutDown = __webpack_require__(/*! ./shut-down */ "./src/server/shut-down.ts");

var _cluster = _interopRequireDefault(__webpack_require__(/*! cluster */ "cluster"));

var _config = __webpack_require__(/*! data/config.yaml */ "./src/data/config.yaml");

var _util = __webpack_require__(/*! util */ "util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_cluster.default.isMaster) {
  (0, _rxjs.fromNodeEvent)(_cluster.default, 'disconnect').pipe((0, _operators.takeUntil)(_shutDown.shuttingDown)).subscribe(() => {
    _cluster.default.fork();
  });
  console.log(`Starting ${_config.workers} workers...`);

  for (let i = 0; i < _config.workers; ++i) {
    _cluster.default.fork();
  }

  _shutDown.shuttingDown.pipe((0, _operators.concatMap)(() => (0, _util.promisify)(_cluster.default.disconnect)())).subscribe(code => {
    console.log(`All workers stopped, exiting...`);
    process.exit(0);
  });
} else {
  __webpack_require__.e(/*! import() | main~server */ "main~server").then(__webpack_require__.t.bind(null, /*! ./main */ "./src/server/main.ts", 7));
}

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "bcrypt-nodejs":
/*!********************************!*\
  !*** external "bcrypt-nodejs" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "core-js/modules/es6.array.sort":
/*!*************************************************!*\
  !*** external "core-js/modules/es6.array.sort" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("core-js/modules/es6.array.sort");

/***/ }),

/***/ "core-js/modules/es7.symbol.async-iterator":
/*!************************************************************!*\
  !*** external "core-js/modules/es7.symbol.async-iterator" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("core-js/modules/es7.symbol.async-iterator");

/***/ }),

/***/ "core-js/modules/web.dom.iterable":
/*!***************************************************!*\
  !*** external "core-js/modules/web.dom.iterable" ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("core-js/modules/web.dom.iterable");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-csp":
/*!******************************!*\
  !*** external "express-csp" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-csp");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "ioredis":
/*!**************************!*\
  !*** external "ioredis" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "sleep-promise":
/*!********************************!*\
  !*** external "sleep-promise" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sleep-promise");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "socket.io-redis":
/*!**********************************!*\
  !*** external "socket.io-redis" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io-redis");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("typeorm");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "uuid/v4":
/*!**************************!*\
  !*** external "uuid/v4" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map
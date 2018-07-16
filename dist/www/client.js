(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["client"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/board.ts":
/*!**********************!*\
  !*** ./src/board.ts ***!
  \**********************/
/*! exports provided: Board */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Board", function() { return Board; });
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ "./node_modules/core-js/modules/es7.symbol.async-iterator.js");
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.symbol */ "./node_modules/core-js/modules/es6.symbol.js");
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var src_grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/grid */ "./src/grid.ts");
/* harmony import */ var src_bounds__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/bounds */ "./src/bounds.ts");
/* harmony import */ var src_square__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/square */ "./src/square.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);







class Board {
    constructor() {
        this.bounds = new src_bounds__WEBPACK_IMPORTED_MODULE_4__["Bounds"](0, 0, 0, 0);
        this.grid = new src_grid__WEBPACK_IMPORTED_MODULE_3__["Grid"](0, 0);
    }
    reset({ width, height }) {
        const grid = new src_grid__WEBPACK_IMPORTED_MODULE_3__["Grid"](width, height), squareSize = {
            width: 64,
            height: 64
        }, gutterSize = {
            width: 6,
            height: 6
        }, bounds = new src_bounds__WEBPACK_IMPORTED_MODULE_4__["Bounds"](0.5, 0.5, 1 + width * (squareSize.width + gutterSize.width) + gutterSize.width, 1 + height * (squareSize.height + gutterSize.height) + gutterSize.height);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const position = {
                    x,
                    y
                }, bounds = new src_bounds__WEBPACK_IMPORTED_MODULE_4__["Bounds"](0.5 + x * (squareSize.width + gutterSize.width) + gutterSize.width, 0.5 + y * (squareSize.height + gutterSize.height) + gutterSize.height, 0.5 + squareSize.width, 0.5 + squareSize.height);
                grid.set({
                    x,
                    y
                }, new src_square__WEBPACK_IMPORTED_MODULE_5__["Square"](position, bounds));
            }
        }
        Object.assign(this, {
            grid,
            bounds
        });
    }
    get width() {
        const width = this.grid.width;
        return width;
    }
    get height() {
        const height = this.grid.height;
        return height;
    }
    get({ x, y }) {
        const grid = this.grid;
        return grid.get({
            x,
            y
        });
    }
    boundsCheck({ x, y }) {
        const grid = this.grid;
        return grid.boundsCheck({
            x,
            y
        });
    }
    getData() {
        return Object.freeze(Array.from(this.grid).map(sq => sq.empty ? null : sq.color));
    }
    setData(data) {
        for (const _ref of Object(lodash__WEBPACK_IMPORTED_MODULE_6__["zip"])(data, Array.from(this.grid))) {
            const color = _ref[0];
            const square = _ref[1];
            square.color = color;
        }
    }
    getGameState(index) {
        return {
            index,
            data: this.getData()
        };
    }
    getMask() {
        return Object.freeze(Array.from(this.grid).map(sq => sq.enabled));
    }
    setMask(mask) {
        for (const _ref2 of Object(lodash__WEBPACK_IMPORTED_MODULE_6__["zip"])(mask, Array.from(this.grid))) {
            const enabled = _ref2[0];
            const square = _ref2[1];
            square.enabled = enabled;
        }
    }
    static fromGame(game, gameState) {
        const board = new Board();
        board.reset(game.size);
        board.setData(gameState.data);
        board.setMask(game.mask);
        return board;
    }
    [Symbol.iterator]() {
        const grid = this.grid;
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
}



/***/ }),

/***/ "./src/bounds.ts":
/*!***********************!*\
  !*** ./src/bounds.ts ***!
  \***********************/
/*! exports provided: Bounds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bounds", function() { return Bounds; });
class Bounds {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    get bottom() {
        const top = this.top, height = this.height;
        return top + height;
    }
    get right() {
        const left = this.left, width = this.width;
        return left + width;
    }
    get center() {
        const left = this.left, top = this.top, width = this.width, height = this.height, x = left + width * .5, y = top + height * .5;
        return {
            x,
            y
        };
    }
    get n() {
        const left = this.left, top = this.top, width = this.width, x = left + width * .5, y = top;
        return {
            x,
            y
        };
    }
    get ne() {
        const left = this.left, top = this.top, width = this.width, x = left + width, y = top;
        return {
            x,
            y
        };
    }
    get e() {
        const left = this.left, top = this.top, width = this.width, height = this.height, x = left + width, y = top + height * .5;
        return {
            x,
            y
        };
    }
    get se() {
        const left = this.left, top = this.top, width = this.width, height = this.height, x = left + width, y = top + height;
        return {
            x,
            y
        };
    }
    get s() {
        const left = this.left, top = this.top, width = this.width, height = this.height, x = left + width * .5, y = top + height;
        return {
            x,
            y
        };
    }
    get sw() {
        const left = this.left, top = this.top, height = this.height, x = left, y = top + height;
        return {
            x,
            y
        };
    }
    get w() {
        const left = this.left, top = this.top, height = this.height, x = left, y = top + height * .5;
        return {
            x,
            y
        };
    }
    get nw() {
        const left = this.left, top = this.top, x = left, y = top;
        return {
            x,
            y
        };
    }
    hitTest({ x, y }) {
        const top = this.top, right = this.right, bottom = this.bottom, left = this.left;
        return x >= left && x <= right && y >= top && y <= bottom;
    }
}



/***/ }),

/***/ "./src/client/app.module.ngfactory.js":
/*!********************************************!*\
  !*** ./src/client/app.module.ngfactory.js ***!
  \********************************************/
/*! exports provided: AppModuleNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModuleNgFactory", function() { return AppModuleNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.module */ "./src/client/app.module.ts");
/* harmony import */ var _r3_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./r3.component */ "./src/client/r3.component.ts");
/* harmony import */ var _node_modules_ngx_bootstrap_modal_modal_backdrop_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/ngx-bootstrap/modal/modal-backdrop.component.ngfactory */ "./node_modules/ngx-bootstrap/modal/modal-backdrop.component.ngfactory.js");
/* harmony import */ var _node_modules_ngx_bootstrap_modal_modal_container_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/ngx-bootstrap/modal/modal-container.component.ngfactory */ "./node_modules/ngx-bootstrap/modal/modal-container.component.ngfactory.js");
/* harmony import */ var _r3_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./r3.component.ngfactory */ "./src/client/r3.component.ngfactory.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var ngx_bootstrap_positioning_positioning_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap/positioning/positioning.service */ "./node_modules/ngx-bootstrap/positioning/positioning.service.js");
/* harmony import */ var ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap/component-loader/component-loader.factory */ "./node_modules/ngx-bootstrap/component-loader/component-loader.factory.js");
/* harmony import */ var ngx_bootstrap_modal_bs_modal_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/modal/bs-modal.service */ "./node_modules/ngx-bootstrap/modal/bs-modal.service.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-zone-scheduler/dist/zone-scheduler */ "./node_modules/ngx-zone-scheduler/dist/zone-scheduler.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _session_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./session.service */ "./src/client/session.service.ts");
/* harmony import */ var _game_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./game.service */ "./src/client/game.service.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/* harmony import */ var ngx_bootstrap_modal_modal_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap/modal/modal.module */ "./node_modules/ngx-bootstrap/modal/modal.module.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _modal_modal_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./modal/modal.module */ "./src/client/modal/modal.module.ts");
/* harmony import */ var ngx_auto_scroll__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ngx-auto-scroll */ "./node_modules/ngx-auto-scroll/ngx-auto-scroll.es5.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ngx-zone-scheduler/dist/zone-scheduler.module */ "./node_modules/ngx-zone-scheduler/dist/zone-scheduler.module.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler_module__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(ngx_zone_scheduler_dist_zone_scheduler_module__WEBPACK_IMPORTED_MODULE_21__);
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_app.module,_r3.component,_.._node_modules_ngx_bootstrap_modal_modal_backdrop.component.ngfactory,_.._node_modules_ngx_bootstrap_modal_modal_container.component.ngfactory,_r3.component.ngfactory,_angular_common,_angular_platform_browser,_angular_forms,_angular_http,ngx_bootstrap_positioning_positioning.service,ngx_bootstrap_component_loader_component_loader.factory,ngx_bootstrap_modal_bs_modal.service,ngx_zone_scheduler_dist_zone_scheduler,_session.service,_game.service,_room.service,ngx_bootstrap_modal_modal.module,_fortawesome_angular_fontawesome,_modal_modal.module,ngx_auto_scroll,ngx_zone_scheduler_dist_zone_scheduler.module PURE_IMPORTS_END */






















var AppModuleNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcmf"](_app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], [_r3_component__WEBPACK_IMPORTED_MODULE_2__["R3Component"]], function (_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmod"]([_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵCodegenComponentFactoryResolver"], [[8, [_node_modules_ngx_bootstrap_modal_modal_backdrop_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["ModalBackdropComponentNgFactory"], _node_modules_ngx_bootstrap_modal_modal_container_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["ModalContainerComponentNgFactory"], _r3_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["R3ComponentNgFactory"]]], [3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModuleRef"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_l"], [[3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgLocalization"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgLocaleLocalization"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"], [2, _angular_common__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_common_common_a"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_ID"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_f"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["IterableDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_j"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["KeyValueDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_k"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["DomSanitizer"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵangular_packages_platform_browser_platform_browser_e"], [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Sanitizer"], null, [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["DomSanitizer"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["HAMMER_GESTURE_CONFIG"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["HammerGestureConfig"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["EVENT_MANAGER_PLUGINS"], function (p0_0, p0_1, p0_2, p1_0, p2_0, p2_1, p2_2) {
            return [new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomEventsPlugin"](p0_0, p0_1, p0_2), new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵKeyEventsPlugin"](p1_0), new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵHammerGesturesPlugin"](p2_0, p2_1, p2_2)];
        }, [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], [2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["PLATFORM_ID"]], _angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["HAMMER_GESTURE_CONFIG"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵConsole"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["EventManager"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["EventManager"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["EVENT_MANAGER_PLUGINS"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](135680, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomSharedStylesHost"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomSharedStylesHost"], [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomRendererFactory2"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomRendererFactory2"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["EventManager"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomSharedStylesHost"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_core__WEBPACK_IMPORTED_MODULE_0__["RendererFactory2"], null, [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomRendererFactory2"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵSharedStylesHost"], null, [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵDomSharedStylesHost"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Testability"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Testability"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["Meta"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["Meta"], [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["Title"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["Title"], [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_i"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_i"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_http__WEBPACK_IMPORTED_MODULE_9__["BrowserXhr"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["BrowserXhr"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_http__WEBPACK_IMPORTED_MODULE_9__["ResponseOptions"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["BaseResponseOptions"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_http__WEBPACK_IMPORTED_MODULE_9__["XSRFStrategy"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["ɵangular_packages_http_http_a"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_http__WEBPACK_IMPORTED_MODULE_9__["XHRBackend"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["XHRBackend"], [_angular_http__WEBPACK_IMPORTED_MODULE_9__["BrowserXhr"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["ResponseOptions"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["XSRFStrategy"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_http__WEBPACK_IMPORTED_MODULE_9__["RequestOptions"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["BaseRequestOptions"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_http__WEBPACK_IMPORTED_MODULE_9__["Http"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["ɵangular_packages_http_http_b"], [_angular_http__WEBPACK_IMPORTED_MODULE_9__["XHRBackend"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["RequestOptions"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, ngx_bootstrap_positioning_positioning_service__WEBPACK_IMPORTED_MODULE_10__["PositioningService"], ngx_bootstrap_positioning_positioning_service__WEBPACK_IMPORTED_MODULE_10__["PositioningService"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_11__["ComponentLoaderFactory"], ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_11__["ComponentLoaderFactory"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], ngx_bootstrap_positioning_positioning_service__WEBPACK_IMPORTED_MODULE_10__["PositioningService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, ngx_bootstrap_modal_bs_modal_service__WEBPACK_IMPORTED_MODULE_12__["BsModalService"], ngx_bootstrap_modal_bs_modal_service__WEBPACK_IMPORTED_MODULE_12__["BsModalService"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["RendererFactory2"], ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_11__["ComponentLoaderFactory"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__["ZoneScheduler"], ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__["ZoneScheduler"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](135680, _session_service__WEBPACK_IMPORTED_MODULE_14__["SessionService"], _session_service__WEBPACK_IMPORTED_MODULE_14__["SessionService"], [ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__["ZoneScheduler"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](135680, _game_service__WEBPACK_IMPORTED_MODULE_15__["GameService"], _game_service__WEBPACK_IMPORTED_MODULE_15__["GameService"], [ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__["ZoneScheduler"], _session_service__WEBPACK_IMPORTED_MODULE_14__["SessionService"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _room_service__WEBPACK_IMPORTED_MODULE_16__["RoomService"], _room_service__WEBPACK_IMPORTED_MODULE_16__["RoomService"], [ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_13__["ZoneScheduler"], _session_service__WEBPACK_IMPORTED_MODULE_14__["SessionService"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_common__WEBPACK_IMPORTED_MODULE_6__["CommonModule"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["CommonModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵangular_packages_platform_browser_platform_browser_a"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_INITIALIZER"], function (p0_0) {
            return [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["ɵangular_packages_platform_browser_platform_browser_h"](p0_0)];
        }, [[2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgProbeToken"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"], [[2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_INITIALIZER"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](131584, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵConsole"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationModule"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationModule"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["BrowserModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["BrowserModule"], [[3, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["BrowserModule"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_bb"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_bb"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_http__WEBPACK_IMPORTED_MODULE_9__["HttpModule"], _angular_http__WEBPACK_IMPORTED_MODULE_9__["HttpModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, ngx_bootstrap_modal_modal_module__WEBPACK_IMPORTED_MODULE_17__["ModalModule"], ngx_bootstrap_modal_modal_module__WEBPACK_IMPORTED_MODULE_17__["ModalModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_18__["FontAwesomeModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_18__["FontAwesomeModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _modal_modal_module__WEBPACK_IMPORTED_MODULE_19__["ModalModule"], _modal_modal_module__WEBPACK_IMPORTED_MODULE_19__["ModalModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, ngx_auto_scroll__WEBPACK_IMPORTED_MODULE_20__["NgxAutoScrollModule"], ngx_auto_scroll__WEBPACK_IMPORTED_MODULE_20__["NgxAutoScrollModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, ngx_zone_scheduler_dist_zone_scheduler_module__WEBPACK_IMPORTED_MODULE_21__["ZoneSchedulerModule"], ngx_zone_scheduler_dist_zone_scheduler_module__WEBPACK_IMPORTED_MODULE_21__["ZoneSchedulerModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], _app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵAPP_ROOT"], true, [])]);
});




/***/ }),

/***/ "./src/client/app.module.ts":
/*!**********************************!*\
  !*** ./src/client/app.module.ts ***!
  \**********************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
class AppModule {
}



/***/ }),

/***/ "./src/client/board.component.ngfactory.js":
/*!*************************************************!*\
  !*** ./src/client/board.component.ngfactory.js ***!
  \*************************************************/
/*! exports provided: RenderType_BoardComponent, View_BoardComponent_0, View_BoardComponent_Host_0, BoardComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_BoardComponent", function() { return RenderType_BoardComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_BoardComponent_0", function() { return View_BoardComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_BoardComponent_Host_0", function() { return View_BoardComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardComponentNgFactory", function() { return BoardComponentNgFactory; });
/* harmony import */ var _board_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.component.scss.shim.ngstyle */ "./src/client/board.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _board_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./board.component */ "./src/client/board.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _board.component.scss.shim.ngstyle,_angular_core,_board.component PURE_IMPORTS_END */



var styles_BoardComponent = [_board_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_BoardComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_BoardComponent,
    data: {}
});

function View_BoardComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            canvasElementRef: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "div", [["class", "col-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, [[1, 0], ["canvasElement", 1]], null, 0, "canvas", [], [[8, "width", 0], [8, "height", 0]], [[null, "mousemove"], [null, "click"], [null, "touch"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("mousemove" === en) {
                var pd_0 = _co.handleEvent(_co.mousemove, $event) !== false;
                ad = pd_0 && ad;
            }
            if ("click" === en) {
                var pd_1 = _co.handleEvent(_co.click, $event) !== false;
                ad = pd_1 && ad;
            }
            if ("touch" === en) {
                var pd_2 = _co.handleEvent(_co.click, $event.touches[0]) !== false;
                ad = pd_2 && ad;
            }
            return ad;
        }, null, null))], null, function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.board == null ? null : _co.board.bounds.width;
        var currVal_1 = _co.board == null ? null : _co.board.bounds.height;
        _ck(_v, 3, 0, currVal_0, currVal_1);
    });
}
function View_BoardComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "board", [], null, null, null, View_BoardComponent_0, RenderType_BoardComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4964352, null, 0, _board_component__WEBPACK_IMPORTED_MODULE_2__["BoardComponent"], [], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var BoardComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("board", _board_component__WEBPACK_IMPORTED_MODULE_2__["BoardComponent"], View_BoardComponent_Host_0, {
    colors: "colors",
    board: "board",
    lastMove: "lastMove"
}, {
    click: "click",
    mousemove: "mousemove"
}, []);




/***/ }),

/***/ "./src/client/board.component.scss.shim.ngstyle.js":
/*!*********************************************************!*\
  !*** ./src/client/board.component.scss.shim.ngstyle.js ***!
  \*********************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = ["canvas[_ngcontent-%COMP%] { object-fit: contain; width: 100%; height: 100%; }"];




/***/ }),

/***/ "./src/client/board.component.ts":
/*!***************************************!*\
  !*** ./src/client/board.component.ts ***!
  \***************************************/
/*! exports provided: BoardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardComponent", function() { return BoardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ "./src/client/canvas.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var data_colors_yaml__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! data/colors.yaml */ "./src/data/colors.yaml");
var data_colors_yaml__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! data/colors.yaml */ "./src/data/colors.yaml", 1);





function toCartesian({ x, y }, center) {
    return {
        x: x - center.x,
        y: center.y - y
    };
}
function fromCartesian({ x, y }, center) {
    return {
        x: x + center.x,
        y: center.y - y
    };
}
function drawRect(c2d, x, y, width, height, r1, r2, r3, r4, ccw = false) {
    c2d.moveTo(x + r4, y);
    if (ccw) {
        c2d.quadraticCurveTo(x, y, x, y + r4);
        c2d.lineTo(x, y + height - r3);
        c2d.quadraticCurveTo(x, y + height, x + r3, y + height);
        c2d.lineTo(x + width - r2, y + height);
        c2d.quadraticCurveTo(x + width, y + height, x + width, y + height - r2);
        c2d.lineTo(x + width, y + r1);
        c2d.quadraticCurveTo(x + width, y, x + width - r1, y);
        c2d.lineTo(x + r4, y);
    }
    else {
        c2d.lineTo(x + width - r1, y);
        c2d.quadraticCurveTo(x + width, y, x + width, y + r1);
        c2d.lineTo(x + width, y + height - r2);
        c2d.quadraticCurveTo(x + width, y + height, x + width - r2, y + height);
        c2d.lineTo(x + r3, y + height);
        c2d.quadraticCurveTo(x, y + height, x, y + height - r3);
        c2d.lineTo(x, y + r4);
        c2d.quadraticCurveTo(x, y, x + r4, y);
    }
}
class BoardComponent {
    constructor() {
        this.dirty = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.colors = [];
        this.lastMove = null;
        this.click = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.mousemove = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngAfterViewInit() {
        const canvas = this.canvas = this.canvasElementRef.nativeElement;
        this.c2d = canvas.getContext('2d');
        this.dirty.next(true);
    }
    ngOnChanges() {
        this.dirty.next(true);
    }
    ngOnDestroy() {
        const dirty = this.dirty;
        dirty.complete();
    }
    ngOnInit() {
        this.dirty.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["observeOn"])(rxjs__WEBPACK_IMPORTED_MODULE_2__["animationFrameScheduler"])).subscribe(() => {
            this.render();
        });
    }
    render() {
        const board = this.board;
        if (!board)
            return;
        const canvas = this.canvas, c2d = this.c2d, width = canvas.width, height = canvas.height, lightSource = {
            x: board.bounds.left + board.bounds.width * .25,
            y: board.bounds.top + board.bounds.height * .25
        };
        c2d.clearRect(0, 0, width, height);
        const squareGradient = c2d.createRadialGradient(lightSource.x, lightSource.y, 0, board.bounds.center.x, board.bounds.center.y, Math.min(board.bounds.width, board.bounds.height) * .7);
        squareGradient.addColorStop(0, 'rgba(255,255,255,.2)');
        squareGradient.addColorStop(.4, 'rgba(255,255,255,0)');
        c2d.beginPath();
        drawRect(c2d, board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height, 20, 20, 20, 20);
        c2d.closePath();
        c2d.save();
        Object.assign(c2d, {
            fillStyle: '#3a3'
        });
        c2d.fill();
        c2d.restore();
        c2d.save();
        Object.assign(c2d, {
            globalCompositeOperation: 'screen',
            fillStyle: squareGradient
        });
        c2d.fill();
        c2d.restore();
        for (const _ref of board) {
            const enabled = _ref.enabled, color = _ref.color, _ref$position = _ref.position, x = _ref$position.x, y = _ref$position.y, _ref$bounds = _ref.bounds, left = _ref$bounds.left, top = _ref$bounds.top, width = _ref$bounds.width, height = _ref$bounds.height, center = _ref$bounds.center;
            if (!enabled)
                continue;
            const lightSourceCart = toCartesian(lightSource, center), lightDirection = Math.atan2(lightSourceCart.y, lightSourceCart.x), lightDistance = 4, shadowCenter = fromCartesian({
                x: Math.cos(lightDirection) * lightDistance,
                y: Math.sin(lightDirection) * lightDistance
            }, center), lightCenter = fromCartesian({
                x: Math.cos(lightDirection + Math.PI) * lightDistance,
                y: Math.sin(lightDirection + Math.PI) * lightDistance
            }, center), path = ccw => {
                drawRect(c2d, left, top, width, height, x === board.width - 1 && y === 0 ? 16 : 4, x === board.width - 1 && y === board.height - 1 ? 16 : 4, x === 0 && y === board.height - 1 ? 16 : 4, x === 0 && y === 0 ? 16 : 4, ccw);
            };
            c2d.beginPath();
            path(false);
            c2d.save();
            Object.assign(c2d, {
                fillStyle: '#6c6',
                strokeStyle: '#363'
            });
            c2d.fill();
            c2d.stroke();
            c2d.restore();
            c2d.save();
            c2d.clip();
            c2d.save();
            Object.assign(c2d, {
                globalCompositeOperation: 'screen',
                fillStyle: squareGradient
            });
            c2d.fill();
            c2d.restore();
            c2d.save();
            c2d.beginPath();
            c2d.rect(board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height);
            path(true);
            Object.assign(c2d, {
                fillStyle: '#000' // shadowColor: 'hsla(0,0%,0%,.4)',
                // shadowBlur: lightDistance,
                // shadowOffsetX: center.x - shadowCenter.x,
                // shadowOffsetY: center.y - shadowCenter.y
            });
            c2d.fill();
            c2d.restore();
            const radius = Math.min(width, height) * .5;
            if (color !== null) {
                const colorDef = data_colors_yaml__WEBPACK_IMPORTED_MODULE_4__["colors"][this.colors[color]];
                const _colorDef$color = colorDef.color, hue = _colorDef$color[0], saturation = _colorDef$color[1], lightness = _colorDef$color[2];
                const hsl = `${hue},${saturation}%,${lightness}%`; // dark stones have highlights, light stones have shadows
                const isDark = lightness < 50, 
                // shadows are reversed from light (+pi radians)
                radialGradient = c2d.createRadialGradient(center.x, center.y, 0, isDark ? lightCenter.x : shadowCenter.x, isDark ? lightCenter.y : shadowCenter.y, radius);
                radialGradient.addColorStop(0, `hsla(${hue},${saturation}%,0%,0)`);
                radialGradient.addColorStop(.5, `hsla(${hue},${saturation}%,0%,.1)`);
                radialGradient.addColorStop(.75, `hsla(${hue},${saturation}%,0%,0)`);
                radialGradient.addColorStop(1, `hsla(${hue},${saturation}%,0%,.75)`);
                c2d.beginPath();
                c2d.arc(center.x, center.y, radius * .8, 0, Math.PI * 2);
                c2d.save();
                Object.assign(c2d, {
                    fillStyle: `hsl(${hsl})`,
                    shadowColor: 'hsla(0,0,0,.4)',
                    shadowBlur: lightDistance,
                    shadowOffsetX: center.x - shadowCenter.x,
                    shadowOffsetY: center.y - shadowCenter.y
                });
                c2d.fill();
                c2d.restore();
                c2d.save();
                Object.assign(c2d, {
                    lineWidth: 1,
                    strokeStyle: 'hsla(0,0,0,.5)'
                });
                c2d.stroke();
                c2d.restore();
                c2d.save();
                Object.assign(c2d, {
                    globalCompositeOperation: isDark ? 'screen' : 'multiply',
                    fillStyle: radialGradient
                });
                c2d.fill();
                c2d.restore();
            }
            c2d.restore();
        }
        const lastMove = this.lastMove;
        if (lastMove) {
            const _board$get = board.get(lastMove), bounds = _board$get.bounds;
            c2d.save();
            const r = 5;
            const p = 7;
            const center = {
                x: bounds.right - r - p,
                y: bounds.top + r + p
            };
            const radialGradient = c2d.createRadialGradient(center.x, center.y, 0, center.x, center.y, r);
            radialGradient.addColorStop(0, `hsl(180,0%,50%)`);
            radialGradient.addColorStop(.5, `hsl(180,100%,50%)`);
            radialGradient.addColorStop(1, `hsl(180,0%,50%)`);
            c2d.fillStyle = radialGradient;
            c2d.beginPath();
            c2d.ellipse(bounds.right - r - p, bounds.top + r + p, r, r, 0, 0, Math.PI * 2);
            c2d.fill();
            c2d.closePath();
            c2d.restore();
        }
    }
    handleEvent(emitter, { clientX, clientY }) {
        const board = this.board, canvas = this.canvas, screenPosition = {
            x: clientX,
            y: clientY
        }, canvasPosition = Object(_canvas__WEBPACK_IMPORTED_MODULE_1__["screenToCanvas"])(canvas, {
            x: clientX,
            y: clientY
        }), square = board.hitTest(canvasPosition), boardPosition = square && square.position || null;
        emitter.emit({
            square,
            position: {
                screen: screenPosition,
                canvas: canvasPosition,
                board: boardPosition
            }
        });
    }
}



/***/ }),

/***/ "./src/client/canvas.ts":
/*!******************************!*\
  !*** ./src/client/canvas.ts ***!
  \******************************/
/*! exports provided: screenToCanvas, canvasToScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "screenToCanvas", function() { return screenToCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvasToScreen", function() { return canvasToScreen; });
function screenToCanvas(canvas, { x, y }) {
    const width = canvas.width, height = canvas.height, rect = canvas.getBoundingClientRect();
    return {
        x: (x - rect.left) * (width / rect.width),
        y: (y - rect.top) * (height / rect.height)
    };
}
function canvasToScreen(canvas, { x, y }) {
    const width = canvas.width, height = canvas.height, rect = canvas.getBoundingClientRect();
    return {
        x: x * (rect.width / width) + rect.left,
        y: y * (rect.height / height) + rect.top
    };
}



/***/ }),

/***/ "./src/client/chat.component.ngfactory.js":
/*!************************************************!*\
  !*** ./src/client/chat.component.ngfactory.js ***!
  \************************************************/
/*! exports provided: RenderType_ChatComponent, View_ChatComponent_0, View_ChatComponent_Host_0, ChatComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ChatComponent", function() { return RenderType_ChatComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ChatComponent_0", function() { return View_ChatComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ChatComponent_Host_0", function() { return View_ChatComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatComponentNgFactory", function() { return ChatComponentNgFactory; });
/* harmony import */ var _chat_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat.component.scss.shim.ngstyle */ "./src/client/chat.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var ngx_auto_scroll__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-auto-scroll */ "./node_modules/ngx-auto-scroll/ngx-auto-scroll.es5.js");
/* harmony import */ var _chat_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./chat.component */ "./src/client/chat.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _chat.component.scss.shim.ngstyle,_angular_core,_angular_common,_angular_forms,_.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,ngx_auto_scroll,_chat.component,_room.service PURE_IMPORTS_END */










var styles_ChatComponent = [_chat_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ChatComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_ChatComponent,
    data: {}
});

function View_ChatComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "h4", [["class", "list-group-item-heading text-muted"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, ["", ""]))], null, function (_ck, _v) {
        var currVal_0 = _v.parent.context.$implicit.user;
        _ck(_v, 1, 0, currVal_0);
    });
}
function View_ChatComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [["class", "list-group-item"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ChatComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "p", [["class", "list-group-item-text mb-0"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](4, null, ["", ""]))], function (_ck, _v) {
        var currVal_0 = _v.context.$implicit.user;
        _ck(_v, 2, 0, currVal_0);
    }, function (_ck, _v) {
        var currVal_1 = _v.context.$implicit.message;
        _ck(_v, 4, 0, currVal_1);
    });
}
function View_ChatComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 26, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 20, "div", [["class", "col-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 19, "form", [["autocomplete", "off"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("submit" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onSubmit($event) !== false;
                ad = pd_0 && ad;
            }
            if ("reset" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onReset() !== false;
                ad = pd_1 && ad;
            }
            if ("ngSubmit" === en) {
                var pd_2 = _co.sendMessage() !== false;
                ad = pd_2 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵangular_packages_forms_forms_bg"], [], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 4210688, [["messageForm", 4]], 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgForm"], [[8, null], [8, null]], null, {
            ngSubmit: "ngSubmit"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ControlContainer"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgForm"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatusGroup"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ControlContainer"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 14, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 13, "div", [["class", "input-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 7, "input", [["autocomplete", "off"], ["class", "form-control"], ["name", "text"], ["placeholder", "Enter message"], ["required", "required"], ["type", "text"]], [[1, "required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            if ("ngModelChange" === en) {
                var pd_4 = (_co.text = $event) !== false;
                ad = pd_4 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["RequiredValidator"], [], {
            required: [0, "required"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NG_VALIDATORS"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["RequiredValidator"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NG_VALUE_ACCESSOR"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ControlContainer"]], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NG_VALIDATORS"]], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, {
            update: "ngModelChange"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 4, "div", [["class", "input-group-append"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 3, "button", [], [[8, "disabled", 0]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 2, "fa-icon", [["class", "ng-fa-icon"], ["transform", "up-2"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](20, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["DomSanitizer"]], {
            iconProp: [0, "iconProp"],
            transform: [1, "transform"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpad"](21, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](22, 0, null, null, 4, "div", [["class", "col-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](23, 0, null, null, 3, "div", [["class", "list-group"], ["ngx-auto-scroll", ""]], null, [[null, "scroll"]], function (_v, en, $event) {
            var ad = true;
            if ("scroll" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 24).scrollHandler() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](24, 1196032, null, 0, ngx_auto_scroll__WEBPACK_IMPORTED_MODULE_7__["NgxAutoScroll"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ChatComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](26, 802816, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], {
            ngForOf: [0, "ngForOf"]
        }, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_15 = "required";
        _ck(_v, 11, 0, currVal_15);
        var currVal_16 = "text";
        var currVal_17 = _co.text;
        _ck(_v, 14, 0, currVal_16, currVal_17);
        var currVal_20 = _ck(_v, 21, 0, "far", "comment");
        var currVal_21 = "up-2";
        _ck(_v, 20, 0, currVal_20, currVal_21);
        var currVal_22 = _co.messages;
        _ck(_v, 26, 0, currVal_22);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassUntouched;
        var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassTouched;
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassPristine;
        var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassDirty;
        var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassValid;
        var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassInvalid;
        var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).ngClassPending;
        _ck(_v, 2, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6);
        var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).required ? "" : null;
        var currVal_8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassUntouched;
        var currVal_9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassTouched;
        var currVal_10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassPristine;
        var currVal_11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassDirty;
        var currVal_12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassValid;
        var currVal_13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassInvalid;
        var currVal_14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 16).ngClassPending;
        _ck(_v, 9, 0, currVal_7, currVal_8, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13, currVal_14);
        var currVal_18 = !_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).form.valid;
        _ck(_v, 18, 0, currVal_18);
        var currVal_19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 20).renderedIconHTML;
        _ck(_v, 19, 0, currVal_19);
    });
}
function View_ChatComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "chat", [], null, null, null, View_ChatComponent_0, RenderType_ChatComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _chat_component__WEBPACK_IMPORTED_MODULE_8__["ChatComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_9__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var ChatComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("chat", _chat_component__WEBPACK_IMPORTED_MODULE_8__["ChatComponent"], View_ChatComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/chat.component.scss.shim.ngstyle.js":
/*!********************************************************!*\
  !*** ./src/client/chat.component.scss.shim.ngstyle.js ***!
  \********************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [".list-group[_ngcontent-%COMP%] { height: 50vh; overflow-y: auto; }\n\n.list-group[_ngcontent-%COMP%]   .list-group-item-text[_ngcontent-%COMP%] { white-space: pre-wrap; }"];




/***/ }),

/***/ "./src/client/chat.component.ts":
/*!**************************************!*\
  !*** ./src/client/chat.component.ts ***!
  \**************************************/
/*! exports provided: ChatComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatComponent", function() { return ChatComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");

class ChatComponent {
    constructor(roomService) {
        this.roomService = roomService;
        this.messages = [];
        this.text = '';
    }
    ngOnInit() {
        const roomService = this.roomService, currentRoom = roomService.getCurrentRoom(), allMessages = roomService.getMessages();
        currentRoom.subscribe(room => {
            this.room = room;
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["combineLatest"])(currentRoom, allMessages, (room, messages) => {
            if (room) {
                return messages.filter(message => message.roomId === room.roomId);
            }
            else {
                return [];
            }
        }).subscribe(messages => {
            this.messages = messages;
        });
    }
    async sendMessage() {
        const roomService = this.roomService, room = this.room, message = this.text;
        if (!room || !message) {
            return;
        }
        this.text = '';
        await roomService.sendMessage(room.roomId, message);
    }
}



/***/ }),

/***/ "./src/client/default.scss":
/*!*********************************!*\
  !*** ./src/client/default.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/client/font-awesome.ts":
/*!************************************!*\
  !*** ./src/client/font-awesome.ts ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "./node_modules/@fortawesome/fontawesome-svg-core/index.es.js");
/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/free-brands-svg-icons */ "./node_modules/@fortawesome/free-brands-svg-icons/index.es.js");
/* harmony import */ var _fortawesome_free_regular_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-regular-svg-icons */ "./node_modules/@fortawesome/free-regular-svg-icons/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");




_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__["library"].add(_fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_1__["fab"], _fortawesome_free_regular_svg_icons__WEBPACK_IMPORTED_MODULE_2__["far"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["fas"]);



/***/ }),

/***/ "./src/client/game.component.ngfactory.js":
/*!************************************************!*\
  !*** ./src/client/game.component.ngfactory.js ***!
  \************************************************/
/*! exports provided: RenderType_GameComponent, View_GameComponent_0, View_GameComponent_Host_0, GameComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_GameComponent", function() { return RenderType_GameComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_GameComponent_0", function() { return View_GameComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_GameComponent_Host_0", function() { return View_GameComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameComponentNgFactory", function() { return GameComponentNgFactory; });
/* harmony import */ var _game_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.component.scss.shim.ngstyle */ "./src/client/game.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _board_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./board.component.ngfactory */ "./src/client/board.component.ngfactory.js");
/* harmony import */ var _board_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./board.component */ "./src/client/board.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _modal_new_game_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modal/new-game.component.ngfactory */ "./src/client/modal/new-game.component.ngfactory.js");
/* harmony import */ var _modal_new_game_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modal/new-game.component */ "./src/client/modal/new-game.component.ts");
/* harmony import */ var _game_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./game.service */ "./src/client/game.service.ts");
/* harmony import */ var _game_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./game.component */ "./src/client/game.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-zone-scheduler/dist/zone-scheduler */ "./node_modules/ngx-zone-scheduler/dist/zone-scheduler.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_10__);
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _game.component.scss.shim.ngstyle,_angular_core,_board.component.ngfactory,_board.component,_angular_common,_modal_new_game.component.ngfactory,_modal_new_game.component,_game.service,_game.component,_room.service,ngx_zone_scheduler_dist_zone_scheduler PURE_IMPORTS_END */











var styles_GameComponent = [_game_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_GameComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_GameComponent,
    data: {}
});

function View_GameComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "div", [["class", "card-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Game Over "]))], null, null);
}
function View_GameComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "div", [["class", "card-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, [" ", "\u2019s Turn "]))], null, function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.turn;
        _ck(_v, 1, 0, currVal_0);
    });
}
function View_GameComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 9, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "div", [["class", "col-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "board", [], null, [[null, "click"], [null, "mousemove"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.onClick($event) !== false;
                ad = pd_0 && ad;
            }
            if ("mousemove" === en) {
                var pd_1 = _co.onMouseMove($event) !== false;
                ad = pd_1 && ad;
            }
            return ad;
        }, _board_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_BoardComponent_0"], _board_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_BoardComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 4964352, null, 0, _board_component__WEBPACK_IMPORTED_MODULE_3__["BoardComponent"], [], {
            colors: [0, "colors"],
            board: [1, "board"],
            lastMove: [2, "lastMove"]
        }, {
            click: "click",
            mousemove: "mousemove"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 5, "div", [["class", "col-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 4, "div", [["class", "card"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_GameComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_GameComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](9, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.colors;
        var currVal_1 = _co.board;
        var currVal_2 = _co.lastMove;
        _ck(_v, 3, 0, currVal_0, currVal_1, currVal_2);
        var currVal_3 = _co.turn == null;
        _ck(_v, 7, 0, currVal_3);
        var currVal_4 = _co.turn != null;
        _ck(_v, 9, 0, currVal_4);
    }, null);
}
function View_GameComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            newGameModal: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_GameComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "modal-new-game", [], null, null, null, _modal_new_game_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_ModalNewGameComponent_0"], _modal_new_game_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_ModalNewGameComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 49152, [[1, 4], ["newGameModal", 4]], 0, _modal_new_game_component__WEBPACK_IMPORTED_MODULE_6__["ModalNewGameComponent"], [_game_service__WEBPACK_IMPORTED_MODULE_7__["GameService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]], null, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.game;
        _ck(_v, 2, 0, currVal_0);
    }, null);
}
function View_GameComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "game", [], null, null, null, View_GameComponent_0, RenderType_GameComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 245760, null, 0, _game_component__WEBPACK_IMPORTED_MODULE_8__["GameComponent"], [_game_service__WEBPACK_IMPORTED_MODULE_7__["GameService"], _room_service__WEBPACK_IMPORTED_MODULE_9__["RoomService"], ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_10__["ZoneScheduler"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var GameComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("game", _game_component__WEBPACK_IMPORTED_MODULE_8__["GameComponent"], View_GameComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/game.component.scss.shim.ngstyle.js":
/*!********************************************************!*\
  !*** ./src/client/game.component.scss.shim.ngstyle.js ***!
  \********************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = ["canvas[_ngcontent-%COMP%] { max-width: 100%; }"];




/***/ }),

/***/ "./src/client/game.component.ts":
/*!**************************************!*\
  !*** ./src/client/game.component.ts ***!
  \**************************************/
/*! exports provided: GameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameComponent", function() { return GameComponent; });
/* harmony import */ var src_rule_sets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/rule-sets */ "./src/rule-sets.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var src_board__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/board */ "./src/board.ts");
/* harmony import */ var data_colors_yaml__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! data/colors.yaml */ "./src/data/colors.yaml");
var data_colors_yaml__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! data/colors.yaml */ "./src/data/colors.yaml", 1);





const rules = src_rule_sets__WEBPACK_IMPORTED_MODULE_0__["rulesStandard"];
class GameComponent {
    constructor(gameService, roomService, scheduler) {
        this.gameService = gameService;
        this.roomService = roomService;
        this.scheduler = scheduler;
        this.colors = null;
        this.turn = null;
        this.room = null;
        this.game = null;
        this.gameState = null;
        this.lastMove = null;
        this.board = new src_board__WEBPACK_IMPORTED_MODULE_3__["Board"]();
        this.rules = null;
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
    }
    ngOnInit() {
        const gameService = this.gameService, roomService = this.roomService, destroyed = this.destroyed, scheduler = this.scheduler;
        const currentRoom = roomService.getCurrentRoom();
        currentRoom.subscribe(room => {
            this.room = room || null;
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(gameService.getGames(), currentRoom, (games, room) => room ? games.filter(game => game.gameId === room.gameId)[0] || null : null).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(destroyed), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["observeOn"])(scheduler)).subscribe(game => {
            this.game = game;
            if (game) {
                const gameState = this.gameState = game.gameStates.slice(-1)[0];
                this.board = src_board__WEBPACK_IMPORTED_MODULE_3__["Board"].fromGame(game, gameState);
                this.lastMove = gameState.lastMove;
                const c = this.colors = [...game.colors];
                if (gameState.turn == null)
                    this.turn = null;
                else
                    this.turn = data_colors_yaml__WEBPACK_IMPORTED_MODULE_4__["colors"][c[gameState.turn]].displayName;
            }
            else {
                this.gameState = null;
                this.board = null;
                this.lastMove = null;
                this.turn = null;
            }
        });
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
    onMouseMove({ square }) {
        if (!square)
            return;
        const game = this.game, gameState = this.gameState;
        document.documentElement.style.cursor = rules.isGameOver(game, gameState) || rules.isValid(game, gameState, square.position, gameState.turn) ? 'pointer' : null;
    }
    onClick({ square }) {
        if (!square)
            return;
        const room = this.room, game = this.game, gameState = this.gameState, gameService = this.gameService, newGameModal = this.newGameModal;
        if (rules.isGameOver(game, gameState)) {
            newGameModal.show(room);
        }
        else {
            gameService.makeMove(room.roomId, square.position);
        }
    }
}



/***/ }),

/***/ "./src/client/game.service.ts":
/*!************************************!*\
  !*** ./src/client/game.service.ts ***!
  \************************************/
/*! exports provided: GameService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameService", function() { return GameService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");


class GameService {
    constructor(scheduler, sessionService) {
        this.scheduler = scheduler;
        this.sessionService = sessionService;
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.allGames = sessionService.getEvents('update').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["scan"])((prev, game) => {
            const games = [...prev];
            const index = games.findIndex(g => g.gameId === game.gameId);
            if (index >= 0) {
                games.splice(index, 1, game);
            }
            else {
                games.push(game);
            }
            return games;
        }, []), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])(1));
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
    getGames() {
        const allGames = this.allGames, scheduler = this.scheduler;
        return allGames.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
    async newGame(roomId, ruleSet) {
        const sessionService = this.sessionService;
        return await sessionService.emit('newGame', {
            roomId,
            ruleSet
        });
    }
    async makeMove(roomId, position) {
        const sessionService = this.sessionService;
        await sessionService.emit('makeMove', {
            roomId,
            position
        });
    }
}



/***/ }),

/***/ "./src/client/lobby.component.ngfactory.js":
/*!*************************************************!*\
  !*** ./src/client/lobby.component.ngfactory.js ***!
  \*************************************************/
/*! exports provided: RenderType_LobbyComponent, View_LobbyComponent_0, View_LobbyComponent_Host_0, LobbyComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_LobbyComponent", function() { return RenderType_LobbyComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_LobbyComponent_0", function() { return View_LobbyComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_LobbyComponent_Host_0", function() { return View_LobbyComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LobbyComponentNgFactory", function() { return LobbyComponentNgFactory; });
/* harmony import */ var _lobby_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lobby.component.scss.shim.ngstyle */ "./src/client/lobby.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _modal_create_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modal/create-room.component.ngfactory */ "./src/client/modal/create-room.component.ngfactory.js");
/* harmony import */ var _modal_create_room_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modal/create-room.component */ "./src/client/modal/create-room.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/* harmony import */ var _modal_join_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modal/join-room.component.ngfactory */ "./src/client/modal/join-room.component.ngfactory.js");
/* harmony import */ var _modal_join_room_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modal/join-room.component */ "./src/client/modal/join-room.component.ts");
/* harmony import */ var _lobby_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./lobby.component */ "./src/client/lobby.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _lobby.component.scss.shim.ngstyle,_angular_core,_.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_angular_common,_modal_create_room.component.ngfactory,_modal_create_room.component,_room.service,_modal_join_room.component.ngfactory,_modal_join_room.component,_lobby.component PURE_IMPORTS_END */












var styles_LobbyComponent = [_lobby_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_LobbyComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_LobbyComponent,
    data: {}
});

function View_LobbyComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [["class", "list-group-item"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" There are no rooms. Would you like to "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "a", [["href", "javascript:"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            if ("click" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 13).show() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["create one"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["? "]))], null, null);
}
function View_LobbyComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "fa-icon", [["class", "mr-2 mt-1 ng-fa-icon"], ["icon", "lock"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null)], function (_ck, _v) {
        var currVal_1 = "lock";
        _ck(_v, 1, 0, currVal_1);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).renderedIconHTML;
        _ck(_v, 0, 0, currVal_0);
    });
}
function View_LobbyComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "div", [["class", "list-group-item d-flex"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_LobbyComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "h4", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](4, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "button", [["class", "btn ml-auto"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.joinRoom(_v.context.$implicit) !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Join "]))], function (_ck, _v) {
        var currVal_0 = _v.context.$implicit.hasPassword;
        _ck(_v, 2, 0, currVal_0);
    }, function (_ck, _v) {
        var currVal_1 = _v.context.$implicit.name;
        _ck(_v, 4, 0, currVal_1);
    });
}
function View_LobbyComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            createRoomModal: 0
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 2, {
            joinRoomModal: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 9, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 5, "div", [["class", "col-12 mb-1"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 4, "div", [["class", "list-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_LobbyComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_LobbyComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 802816, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], {
            ngForOf: [0, "ngForOf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 2, "div", [["class", "col-12 clearfix mt-1"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 1, "button", [["class", "btn float-right mr-2"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            if ("click" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).show() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Create Room "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 1, "modal-create-room", [], null, null, null, _modal_create_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ModalCreateRoomComponent_0"], _modal_create_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ModalCreateRoomComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 49152, [[1, 4], ["createRoomModal", 4]], 0, _modal_create_room_component__WEBPACK_IMPORTED_MODULE_7__["ModalCreateRoomComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_8__["RoomService"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 1, "modal-join-room", [], null, null, null, _modal_join_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["View_ModalJoinRoomComponent_0"], _modal_join_room_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["RenderType_ModalJoinRoomComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](15, 49152, [[2, 4], ["joinRoomModal", 4]], 0, _modal_join_room_component__WEBPACK_IMPORTED_MODULE_10__["ModalJoinRoomComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_8__["RoomService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]], null, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.rooms.length === 0;
        _ck(_v, 6, 0, currVal_0);
        var currVal_1 = _co.rooms;
        _ck(_v, 8, 0, currVal_1);
    }, null);
}
function View_LobbyComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "lobby", [], null, null, null, View_LobbyComponent_0, RenderType_LobbyComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 245760, null, 0, _lobby_component__WEBPACK_IMPORTED_MODULE_11__["LobbyComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_8__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var LobbyComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("lobby", _lobby_component__WEBPACK_IMPORTED_MODULE_11__["LobbyComponent"], View_LobbyComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/lobby.component.scss.shim.ngstyle.js":
/*!*********************************************************!*\
  !*** ./src/client/lobby.component.scss.shim.ngstyle.js ***!
  \*********************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];




/***/ }),

/***/ "./src/client/lobby.component.ts":
/*!***************************************!*\
  !*** ./src/client/lobby.component.ts ***!
  \***************************************/
/*! exports provided: LobbyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LobbyComponent", function() { return LobbyComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");


class LobbyComponent {
    constructor(roomService) {
        this.roomService = roomService;
        this.rooms = [];
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
    }
    ngOnInit() {
        const destroyed = this.destroyed, roomService = this.roomService;
        roomService.getRooms().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(rooms => {
            this.rooms = rooms;
        });
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
    async joinRoom(room) {
        const roomService = this.roomService;
        const joinedRooms = await roomService.getJoinedRooms().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).toPromise();
        if (joinedRooms.some(r => r.roomId === room.roomId)) {
            await roomService.setRoom(room);
        }
        else if (room.hasPassword) {
            this.joinRoomModal.show(room);
        }
        else {
            await roomService.joinRoom(room, '');
        }
    }
}



/***/ }),

/***/ "./src/client/main.ts":
/*!****************************!*\
  !*** ./src/client/main.ts ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _default_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default.scss */ "./src/client/default.scss");
/* harmony import */ var _default_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_default_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "./src/client/polyfills.ts");
/* harmony import */ var _vendor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vendor */ "./src/client/vendor.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_module_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.module.ngfactory */ "./src/client/app.module.ngfactory.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");






if (location.hostname !== 'localhost') {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["platformBrowser"]().bootstrapModuleFactory(_app_module_ngfactory__WEBPACK_IMPORTED_MODULE_4__["AppModuleNgFactory"]);



/***/ }),

/***/ "./src/client/modal/create-room.component.ngfactory.js":
/*!*************************************************************!*\
  !*** ./src/client/modal/create-room.component.ngfactory.js ***!
  \*************************************************************/
/*! exports provided: RenderType_ModalCreateRoomComponent, View_ModalCreateRoomComponent_0, View_ModalCreateRoomComponent_Host_0, ModalCreateRoomComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ModalCreateRoomComponent", function() { return RenderType_ModalCreateRoomComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalCreateRoomComponent_0", function() { return View_ModalCreateRoomComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalCreateRoomComponent_Host_0", function() { return View_ModalCreateRoomComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalCreateRoomComponentNgFactory", function() { return ModalCreateRoomComponentNgFactory; });
/* harmony import */ var _create_room_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-room.component.scss.shim.ngstyle */ "./src/client/modal/create-room.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap/modal/modal.directive */ "./node_modules/ngx-bootstrap/modal/modal.directive.js");
/* harmony import */ var ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap/component-loader/component-loader.factory */ "./node_modules/ngx-bootstrap/component-loader/component-loader.factory.js");
/* harmony import */ var _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header.component.ngfactory */ "./src/client/modal/header.component.ngfactory.js");
/* harmony import */ var _header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header.component */ "./src/client/modal/header.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _create_room_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./create-room.component */ "./src/client/modal/create-room.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../room.service */ "./src/client/room.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _create_room.component.scss.shim.ngstyle,_angular_core,ngx_bootstrap_modal_modal.directive,ngx_bootstrap_component_loader_component_loader.factory,_header.component.ngfactory,_header.component,_angular_forms,_.._.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_create_room.component,_room.service PURE_IMPORTS_END */












var styles_ModalCreateRoomComponent = [_create_room_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ModalCreateRoomComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_ModalCreateRoomComponent,
    data: {}
});

function View_ModalCreateRoomComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            createRoomModal: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 16777216, null, null, 40, "div", [["aria-hidden", "true"], ["bsModal", ""], ["class", "modal fade"], ["role", "dialog"], ["tabindex", "-1"]], null, [[null, "onHidden"], [null, "onShown"], [null, "click"], [null, "keydown.esc"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onClick($event) !== false;
                ad = pd_0 && ad;
            }
            if ("keydown.esc" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onEsc($event) !== false;
                ad = pd_1 && ad;
            }
            if ("onHidden" === en) {
                _co.roomName = "";
                var pd_2 = (_co.password = "") !== false;
                ad = pd_2 && ad;
            }
            if ("onShown" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 20).focus() !== false;
                ad = pd_3 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 212992, [[1, 4], ["createRoomModal", 4]], 0, ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_2__["ModalDirective"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_3__["ComponentLoaderFactory"]], null, {
            onShown: "onShown",
            onHidden: "onHidden"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 38, "div", [["class", "modal-dialog modal-lg"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 37, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "modal-header", [], null, [[null, "closeClick"]], function (_v, en, $event) {
            var ad = true;
            if ("closeClick" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).hide() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_ModalHeaderComponent_0"], _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_ModalHeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 49152, null, 0, _header_component__WEBPACK_IMPORTED_MODULE_5__["ModalHeaderComponent"], [], null, {
            closeClick: "closeClick"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, 0, [" Create Room "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 33, "div", [["class", "modal-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 32, "form", [["autocomplete", "off"], ["class", "clearfix"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("submit" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onSubmit($event) !== false;
                ad = pd_0 && ad;
            }
            if ("reset" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onReset() !== false;
                ad = pd_1 && ad;
            }
            if ("ngSubmit" === en) {
                var pd_2 = _co.createRoom() !== false;
                ad = pd_2 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_forms_forms_bg"], [], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 4210688, [["createRoomForm", 4]], 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"], [[8, null], [8, null]], null, {
            ngSubmit: "ngSubmit"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatusGroup"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 13, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 12, "div", [["class", "input-group mb-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 3, "div", [["class", "input-group-prepend"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 2, "div", [["class", "input-group-text"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "door-open"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](19, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, [["roomNameText", 1]], null, 7, "input", [["autocomplete", "off"], ["class", "form-control"], ["name", "room-name"], ["placeholder", "Room Name"], ["required", "required"], ["type", "text"]], [[1, "required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            if ("ngModelChange" === en) {
                var pd_4 = (_co.roomName = $event) !== false;
                ad = pd_4 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](21, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](22, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"], [], {
            required: [0, "required"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALIDATORS"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALIDATORS"]], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, {
            update: "ngModelChange"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](27, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](28, 0, null, null, 11, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](29, 0, null, null, 10, "div", [["class", "input-group mb-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](30, 0, null, null, 3, "div", [["class", "input-group-prepend"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](31, 0, null, null, 2, "div", [["class", "input-group-text"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](32, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "lock"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](33, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](34, 0, null, null, 5, "input", [["autocomplete", "off"], ["class", "form-control"], ["name", "room-password"], ["placeholder", "Password (optional)"], ["type", "password"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 35)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 35).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 35)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 35)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            if ("ngModelChange" === en) {
                var pd_4 = (_co.password = $event) !== false;
                ad = pd_4 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](35, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](37, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, {
            update: "ngModelChange"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](39, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](40, 0, null, null, 1, "button", [["class", "btn float-right"]], [[8, "disabled", 0]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Create "]))], function (_ck, _v) {
        var _co = _v.component;
        _ck(_v, 2, 0);
        var currVal_8 = "door-open";
        _ck(_v, 19, 0, currVal_8);
        var currVal_17 = "required";
        _ck(_v, 22, 0, currVal_17);
        var currVal_18 = "room-name";
        var currVal_19 = _co.roomName;
        _ck(_v, 25, 0, currVal_18, currVal_19);
        var currVal_21 = "lock";
        _ck(_v, 33, 0, currVal_21);
        var currVal_29 = "room-password";
        var currVal_30 = _co.password;
        _ck(_v, 37, 0, currVal_29, currVal_30);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassUntouched;
        var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassTouched;
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPristine;
        var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassDirty;
        var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassValid;
        var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassInvalid;
        var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPending;
        _ck(_v, 9, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6);
        var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).renderedIconHTML;
        _ck(_v, 18, 0, currVal_7);
        var currVal_9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 22).required ? "" : null;
        var currVal_10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassUntouched;
        var currVal_11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassTouched;
        var currVal_12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassPristine;
        var currVal_13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassDirty;
        var currVal_14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassValid;
        var currVal_15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassInvalid;
        var currVal_16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 27).ngClassPending;
        _ck(_v, 20, 0, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13, currVal_14, currVal_15, currVal_16);
        var currVal_20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 33).renderedIconHTML;
        _ck(_v, 32, 0, currVal_20);
        var currVal_22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassUntouched;
        var currVal_23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassTouched;
        var currVal_24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassPristine;
        var currVal_25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassDirty;
        var currVal_26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassValid;
        var currVal_27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassInvalid;
        var currVal_28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassPending;
        _ck(_v, 34, 0, currVal_22, currVal_23, currVal_24, currVal_25, currVal_26, currVal_27, currVal_28);
        var currVal_31 = !_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).form.valid;
        _ck(_v, 40, 0, currVal_31);
    });
}
function View_ModalCreateRoomComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "modal-create-room", [], null, null, null, View_ModalCreateRoomComponent_0, RenderType_ModalCreateRoomComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 49152, null, 0, _create_room_component__WEBPACK_IMPORTED_MODULE_10__["ModalCreateRoomComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_11__["RoomService"]], null, null)], null, null);
}
var ModalCreateRoomComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("modal-create-room", _create_room_component__WEBPACK_IMPORTED_MODULE_10__["ModalCreateRoomComponent"], View_ModalCreateRoomComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/modal/create-room.component.scss.shim.ngstyle.js":
/*!*********************************************************************!*\
  !*** ./src/client/modal/create-room.component.scss.shim.ngstyle.js ***!
  \*********************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];




/***/ }),

/***/ "./src/client/modal/create-room.component.ts":
/*!***************************************************!*\
  !*** ./src/client/modal/create-room.component.ts ***!
  \***************************************************/
/*! exports provided: ModalCreateRoomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalCreateRoomComponent", function() { return ModalCreateRoomComponent; });
class ModalCreateRoomComponent {
    constructor(roomService) {
        this.roomService = roomService;
        this.rooms = [];
        this.roomName = '';
        this.password = '';
    }
    show() {
        const createRoomModal = this.createRoomModal;
        createRoomModal.show();
    }
    hide() {
        const createRoomModal = this.createRoomModal;
        createRoomModal.hide();
    }
    async createRoom() {
        const roomService = this.roomService, roomName = this.roomName, password = this.password;
        if (!roomName) {
            return;
        }
        this.hide();
        await roomService.createRoom(roomName, password);
    }
}



/***/ }),

/***/ "./src/client/modal/header.component.ngfactory.js":
/*!********************************************************!*\
  !*** ./src/client/modal/header.component.ngfactory.js ***!
  \********************************************************/
/*! exports provided: RenderType_ModalHeaderComponent, View_ModalHeaderComponent_0, View_ModalHeaderComponent_Host_0, ModalHeaderComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ModalHeaderComponent", function() { return RenderType_ModalHeaderComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalHeaderComponent_0", function() { return View_ModalHeaderComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalHeaderComponent_Host_0", function() { return View_ModalHeaderComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalHeaderComponentNgFactory", function() { return ModalHeaderComponentNgFactory; });
/* harmony import */ var _header_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.component.scss.shim.ngstyle */ "./src/client/modal/header.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _header_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./header.component */ "./src/client/modal/header.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _header.component.scss.shim.ngstyle,_angular_core,_.._.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_angular_common,_header.component PURE_IMPORTS_END */







var styles_ModalHeaderComponent = [_header_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ModalHeaderComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_ModalHeaderComponent,
    data: {}
});

function View_ModalHeaderComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "button", [["aria-label", "Close"], ["class", "close"], ["type", "button"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.closeClick.emit() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "times"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null)], function (_ck, _v) {
        var currVal_1 = "times";
        _ck(_v, 3, 0, currVal_1);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 3).renderedIconHTML;
        _ck(_v, 2, 0, currVal_0);
    });
}
function View_ModalHeaderComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [["class", "modal-header"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "h4", [["class", "modal-title"]], null, null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵncd"](null, 0), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ModalHeaderComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = _co.showCloseButton;
        _ck(_v, 4, 0, currVal_0);
    }, null);
}
function View_ModalHeaderComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "modal-header", [], null, null, null, View_ModalHeaderComponent_0, RenderType_ModalHeaderComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 49152, null, 0, _header_component__WEBPACK_IMPORTED_MODULE_6__["ModalHeaderComponent"], [], null, null)], null, null);
}
var ModalHeaderComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("modal-header", _header_component__WEBPACK_IMPORTED_MODULE_6__["ModalHeaderComponent"], View_ModalHeaderComponent_Host_0, {
    showCloseButton: "showCloseButton"
}, {
    closeClick: "closeClick"
}, ["*"]);




/***/ }),

/***/ "./src/client/modal/header.component.scss.shim.ngstyle.js":
/*!****************************************************************!*\
  !*** ./src/client/modal/header.component.scss.shim.ngstyle.js ***!
  \****************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];




/***/ }),

/***/ "./src/client/modal/header.component.ts":
/*!**********************************************!*\
  !*** ./src/client/modal/header.component.ts ***!
  \**********************************************/
/*! exports provided: ModalHeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalHeaderComponent", function() { return ModalHeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

class ModalHeaderComponent {
    constructor() {
        this.showCloseButton = true;
        this.closeClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
}



/***/ }),

/***/ "./src/client/modal/join-room.component.ngfactory.js":
/*!***********************************************************!*\
  !*** ./src/client/modal/join-room.component.ngfactory.js ***!
  \***********************************************************/
/*! exports provided: RenderType_ModalJoinRoomComponent, View_ModalJoinRoomComponent_0, View_ModalJoinRoomComponent_Host_0, ModalJoinRoomComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ModalJoinRoomComponent", function() { return RenderType_ModalJoinRoomComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalJoinRoomComponent_0", function() { return View_ModalJoinRoomComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalJoinRoomComponent_Host_0", function() { return View_ModalJoinRoomComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalJoinRoomComponentNgFactory", function() { return ModalJoinRoomComponentNgFactory; });
/* harmony import */ var _join_room_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./join-room.component.scss.shim.ngstyle */ "./src/client/modal/join-room.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap/modal/modal.directive */ "./node_modules/ngx-bootstrap/modal/modal.directive.js");
/* harmony import */ var ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap/component-loader/component-loader.factory */ "./node_modules/ngx-bootstrap/component-loader/component-loader.factory.js");
/* harmony import */ var _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header.component.ngfactory */ "./src/client/modal/header.component.ngfactory.js");
/* harmony import */ var _header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header.component */ "./src/client/modal/header.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _join_room_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./join-room.component */ "./src/client/modal/join-room.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../room.service */ "./src/client/room.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _join_room.component.scss.shim.ngstyle,_angular_core,ngx_bootstrap_modal_modal.directive,ngx_bootstrap_component_loader_component_loader.factory,_header.component.ngfactory,_header.component,_angular_forms,_.._.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_join_room.component,_room.service PURE_IMPORTS_END */












var styles_ModalJoinRoomComponent = [_join_room_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ModalJoinRoomComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_ModalJoinRoomComponent,
    data: {}
});

function View_ModalJoinRoomComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            joinRoomModal: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 16777216, null, null, 40, "div", [["aria-hidden", "true"], ["bsModal", ""], ["class", "modal fade"], ["role", "dialog"], ["tabindex", "-1"]], null, [[null, "onHidden"], [null, "onShown"], [null, "click"], [null, "keydown.esc"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onClick($event) !== false;
                ad = pd_0 && ad;
            }
            if ("keydown.esc" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onEsc($event) !== false;
                ad = pd_1 && ad;
            }
            if ("onHidden" === en) {
                var pd_2 = (_co.password = "") !== false;
                ad = pd_2 && ad;
            }
            if ("onShown" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 32).focus() !== false;
                ad = pd_3 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 212992, [[1, 4], ["joinRoomModal", 4]], 0, ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_2__["ModalDirective"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_3__["ComponentLoaderFactory"]], null, {
            onShown: "onShown",
            onHidden: "onHidden"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 38, "div", [["class", "modal-dialog modal-lg"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 37, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "modal-header", [], null, [[null, "closeClick"]], function (_v, en, $event) {
            var ad = true;
            if ("closeClick" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).hide() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_ModalHeaderComponent_0"], _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_ModalHeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 49152, null, 0, _header_component__WEBPACK_IMPORTED_MODULE_5__["ModalHeaderComponent"], [], null, {
            closeClick: "closeClick"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, 0, [" Join Room "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 33, "div", [["class", "modal-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 32, "form", [["autocomplete", "off"], ["class", "clearfix"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("submit" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onSubmit($event) !== false;
                ad = pd_0 && ad;
            }
            if ("reset" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onReset() !== false;
                ad = pd_1 && ad;
            }
            if ("ngSubmit" === en) {
                var pd_2 = _co.joinRoom() !== false;
                ad = pd_2 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵangular_packages_forms_forms_bg"], [], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 4210688, [["joinRoomForm", 4]], 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"], [[8, null], [8, null]], null, {
            ngSubmit: "ngSubmit"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatusGroup"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 11, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 10, "div", [["class", "input-group mb-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 3, "div", [["class", "input-group-prepend"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 2, "div", [["class", "input-group-text"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "door-closed"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](19, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, null, null, 5, "input", [["autocomplete", "off"], ["class", "form-control"], ["name", "room-name"], ["readonly", "readonly"], ["type", "text"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 21)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](21, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](23, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](26, 0, null, null, 13, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](27, 0, null, null, 12, "div", [["class", "input-group mb-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](28, 0, null, null, 3, "div", [["class", "input-group-prepend"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](29, 0, null, null, 2, "div", [["class", "input-group-text"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](30, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "key"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](31, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](32, 0, [["roomPasswordText", 1]], null, 7, "input", [["autocomplete", "off"], ["class", "form-control"], ["name", "room-password"], ["placeholder", "Password"], ["required", "required"], ["type", "password"]], [[1, "required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 33)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 33).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 33)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 33)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            if ("ngModelChange" === en) {
                var pd_4 = (_co.password = $event) !== false;
                ad = pd_4 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](33, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](34, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"], [], {
            required: [0, "required"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALIDATORS"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["RequiredValidator"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](37, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ControlContainer"]], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALIDATORS"]], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, {
            update: "ngModelChange"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](39, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](40, 0, null, null, 1, "button", [["class", "btn float-right"]], [[8, "disabled", 0]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Join "]))], function (_ck, _v) {
        var _co = _v.component;
        _ck(_v, 2, 0);
        var currVal_8 = "door-closed";
        _ck(_v, 19, 0, currVal_8);
        var currVal_16 = "room-name";
        var currVal_17 = _co.room == null ? null : _co.room.name;
        _ck(_v, 23, 0, currVal_16, currVal_17);
        var currVal_19 = "key";
        _ck(_v, 31, 0, currVal_19);
        var currVal_28 = "required";
        _ck(_v, 34, 0, currVal_28);
        var currVal_29 = "room-password";
        var currVal_30 = _co.password;
        _ck(_v, 37, 0, currVal_29, currVal_30);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassUntouched;
        var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassTouched;
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPristine;
        var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassDirty;
        var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassValid;
        var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassInvalid;
        var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPending;
        _ck(_v, 9, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6);
        var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).renderedIconHTML;
        _ck(_v, 18, 0, currVal_7);
        var currVal_9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassUntouched;
        var currVal_10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassTouched;
        var currVal_11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassPristine;
        var currVal_12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassDirty;
        var currVal_13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassValid;
        var currVal_14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassInvalid;
        var currVal_15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).ngClassPending;
        _ck(_v, 20, 0, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13, currVal_14, currVal_15);
        var currVal_18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 31).renderedIconHTML;
        _ck(_v, 30, 0, currVal_18);
        var currVal_20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 34).required ? "" : null;
        var currVal_21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassUntouched;
        var currVal_22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassTouched;
        var currVal_23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassPristine;
        var currVal_24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassDirty;
        var currVal_25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassValid;
        var currVal_26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassInvalid;
        var currVal_27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 39).ngClassPending;
        _ck(_v, 32, 0, currVal_20, currVal_21, currVal_22, currVal_23, currVal_24, currVal_25, currVal_26, currVal_27);
        var currVal_31 = !_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).form.valid;
        _ck(_v, 40, 0, currVal_31);
    });
}
function View_ModalJoinRoomComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "modal-join-room", [], null, null, null, View_ModalJoinRoomComponent_0, RenderType_ModalJoinRoomComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 49152, null, 0, _join_room_component__WEBPACK_IMPORTED_MODULE_10__["ModalJoinRoomComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_11__["RoomService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]], null, null)], null, null);
}
var ModalJoinRoomComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("modal-join-room", _join_room_component__WEBPACK_IMPORTED_MODULE_10__["ModalJoinRoomComponent"], View_ModalJoinRoomComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/modal/join-room.component.scss.shim.ngstyle.js":
/*!*******************************************************************!*\
  !*** ./src/client/modal/join-room.component.scss.shim.ngstyle.js ***!
  \*******************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];




/***/ }),

/***/ "./src/client/modal/join-room.component.ts":
/*!*************************************************!*\
  !*** ./src/client/modal/join-room.component.ts ***!
  \*************************************************/
/*! exports provided: ModalJoinRoomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalJoinRoomComponent", function() { return ModalJoinRoomComponent; });
class ModalJoinRoomComponent {
    constructor(roomService, zone) {
        this.roomService = roomService;
        this.zone = zone;
        this.password = '';
    }
    show(room) {
        const joinRoomModal = this.joinRoomModal, zone = this.zone;
        zone.run(() => {
            this.room = room;
            joinRoomModal.show();
        });
    }
    hide() {
        const joinRoomModal = this.joinRoomModal, zone = this.zone;
        zone.run(() => {
            this.room = null;
            joinRoomModal.hide();
        });
    }
    async joinRoom() {
        const roomService = this.roomService, room = this.room, password = this.password;
        this.hide();
        await roomService.joinRoom(room, password);
    }
}



/***/ }),

/***/ "./src/client/modal/modal.module.ts":
/*!******************************************!*\
  !*** ./src/client/modal/modal.module.ts ***!
  \******************************************/
/*! exports provided: ModalModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalModule", function() { return ModalModule; });
class ModalModule {
}



/***/ }),

/***/ "./src/client/modal/new-game.component.ngfactory.js":
/*!**********************************************************!*\
  !*** ./src/client/modal/new-game.component.ngfactory.js ***!
  \**********************************************************/
/*! exports provided: RenderType_ModalNewGameComponent, View_ModalNewGameComponent_0, View_ModalNewGameComponent_Host_0, ModalNewGameComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ModalNewGameComponent", function() { return RenderType_ModalNewGameComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalNewGameComponent_0", function() { return View_ModalNewGameComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ModalNewGameComponent_Host_0", function() { return View_ModalNewGameComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalNewGameComponentNgFactory", function() { return ModalNewGameComponentNgFactory; });
/* harmony import */ var _new_game_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./new-game.component.scss.shim.ngstyle */ "./src/client/modal/new-game.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap/modal/modal.directive */ "./node_modules/ngx-bootstrap/modal/modal.directive.js");
/* harmony import */ var ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/component-loader/component-loader.factory */ "./node_modules/ngx-bootstrap/component-loader/component-loader.factory.js");
/* harmony import */ var _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header.component.ngfactory */ "./src/client/modal/header.component.ngfactory.js");
/* harmony import */ var _header_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./header.component */ "./src/client/modal/header.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _new_game_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./new-game.component */ "./src/client/modal/new-game.component.ts");
/* harmony import */ var _game_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../game.service */ "./src/client/game.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _new_game.component.scss.shim.ngstyle,_angular_core,_angular_forms,ngx_bootstrap_modal_modal.directive,ngx_bootstrap_component_loader_component_loader.factory,_header.component.ngfactory,_header.component,_angular_common,_new_game.component,_game.service PURE_IMPORTS_END */










var styles_ModalNewGameComponent = [_new_game_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ModalNewGameComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_ModalNewGameComponent,
    data: {}
});

function View_ModalNewGameComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 11, "div", [["class", "form-check-inline"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 10, "label", [["class", "form-check-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 8, "input", [["class", "form-check-input"], ["name", "ruleSet"], ["required", "required"], ["type", "radio"]], [[1, "required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "change"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("input" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 3)._handleInput($event.target.value) !== false;
                ad = pd_0 && ad;
            }
            if ("blur" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 3).onTouched() !== false;
                ad = pd_1 && ad;
            }
            if ("compositionstart" === en) {
                var pd_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 3)._compositionStart() !== false;
                ad = pd_2 && ad;
            }
            if ("compositionend" === en) {
                var pd_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 3)._compositionEnd($event.target.value) !== false;
                ad = pd_3 && ad;
            }
            if ("change" === en) {
                var pd_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onChange() !== false;
                ad = pd_4 && ad;
            }
            if ("blur" === en) {
                var pd_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onTouched() !== false;
                ad = pd_5 && ad;
            }
            if ("ngModelChange" === en) {
                var pd_6 = (_co.ruleSet = $event) !== false;
                ad = pd_6 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 212992, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["RadioControlValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_i"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"]], {
            name: [0, "name"],
            value: [1, "value"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](5, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["RequiredValidator"], [], {
            required: [0, "required"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALIDATORS"], function (p0_0) {
            return [p0_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["RequiredValidator"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0, p1_0) {
            return [p0_0, p1_0];
        }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["RadioControlValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], [[2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"]], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALIDATORS"]], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"]]], {
            name: [0, "name"],
            model: [1, "model"]
        }, {
            update: "ngModelChange"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](11, null, [" ", " "]))], function (_ck, _v) {
        var _co = _v.component;
        var currVal_8 = "ruleSet";
        var currVal_9 = _v.context.$implicit.ruleSet;
        _ck(_v, 4, 0, currVal_8, currVal_9);
        var currVal_10 = "required";
        _ck(_v, 5, 0, currVal_10);
        var currVal_11 = "ruleSet";
        var currVal_12 = _co.ruleSet;
        _ck(_v, 8, 0, currVal_11, currVal_12);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 5).required ? "" : null;
        var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassUntouched;
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassTouched;
        var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassPristine;
        var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassDirty;
        var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassValid;
        var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassInvalid;
        var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 10).ngClassPending;
        _ck(_v, 2, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7);
        var currVal_13 = _v.context.$implicit.name;
        _ck(_v, 11, 0, currVal_13);
    });
}
function View_ModalNewGameComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, {
            newGameModal: 0
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 16777216, null, null, 19, "div", [["aria-hidden", "true"], ["bsModal", ""], ["class", "modal fade"], ["role", "dialog"], ["tabindex", "-1"]], null, [[null, "click"], [null, "keydown.esc"]], function (_v, en, $event) {
            var ad = true;
            if ("click" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onClick($event) !== false;
                ad = pd_0 && ad;
            }
            if ("keydown.esc" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).onEsc($event) !== false;
                ad = pd_1 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 212992, [[1, 4], ["newGameModal", 4]], 0, ngx_bootstrap_modal_modal_directive__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], ngx_bootstrap_component_loader_component_loader_factory__WEBPACK_IMPORTED_MODULE_4__["ComponentLoaderFactory"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 17, "div", [["class", "modal-dialog modal-lg"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 16, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "modal-header", [], null, [[null, "closeClick"]], function (_v, en, $event) {
            var ad = true;
            if ("closeClick" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 2).hide() !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_ModalHeaderComponent_0"], _header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_ModalHeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 49152, null, 0, _header_component__WEBPACK_IMPORTED_MODULE_6__["ModalHeaderComponent"], [], null, {
            closeClick: "closeClick"
        }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, 0, [" New Game "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 12, "div", [["class", "modal-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 11, "form", [["autocomplete", "off"], ["class", "clearfix"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("submit" === en) {
                var pd_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onSubmit($event) !== false;
                ad = pd_0 && ad;
            }
            if ("reset" === en) {
                var pd_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).onReset() !== false;
                ad = pd_1 && ad;
            }
            if ("ngSubmit" === en) {
                var pd_2 = _co.newGame() !== false;
                ad = pd_2 && ad;
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_bg"], [], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 4210688, [["newGameForm", 4]], 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgForm"], [[8, null], [8, null]], null, {
            ngSubmit: "ngSubmit"
        }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgForm"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatusGroup"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 4, "fieldset", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 1, "legend", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Rule Set"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ModalNewGameComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](18, 802816, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], {
            ngForOf: [0, "ngForOf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 1, "button", [["class", "btn float-right"]], [[8, "disabled", 0]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Start "]))], function (_ck, _v) {
        var _co = _v.component;
        _ck(_v, 2, 0);
        var currVal_7 = _co.ruleSets;
        _ck(_v, 18, 0, currVal_7);
    }, function (_ck, _v) {
        var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassUntouched;
        var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassTouched;
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPristine;
        var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassDirty;
        var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassValid;
        var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassInvalid;
        var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPending;
        _ck(_v, 9, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6);
        var currVal_8 = !_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 11).form.valid;
        _ck(_v, 19, 0, currVal_8);
    });
}
function View_ModalNewGameComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "modal-new-game", [], null, null, null, View_ModalNewGameComponent_0, RenderType_ModalNewGameComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 49152, null, 0, _new_game_component__WEBPACK_IMPORTED_MODULE_8__["ModalNewGameComponent"], [_game_service__WEBPACK_IMPORTED_MODULE_9__["GameService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]], null, null)], null, null);
}
var ModalNewGameComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("modal-new-game", _new_game_component__WEBPACK_IMPORTED_MODULE_8__["ModalNewGameComponent"], View_ModalNewGameComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/modal/new-game.component.scss.shim.ngstyle.js":
/*!******************************************************************!*\
  !*** ./src/client/modal/new-game.component.scss.shim.ngstyle.js ***!
  \******************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];




/***/ }),

/***/ "./src/client/modal/new-game.component.ts":
/*!************************************************!*\
  !*** ./src/client/modal/new-game.component.ts ***!
  \************************************************/
/*! exports provided: ModalNewGameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalNewGameComponent", function() { return ModalNewGameComponent; });
/* harmony import */ var src_rule_sets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/rule-sets */ "./src/rule-sets.ts");

class ModalNewGameComponent {
    constructor(gameService, zone) {
        this.gameService = gameService;
        this.zone = zone;
        this.ruleSets = src_rule_sets__WEBPACK_IMPORTED_MODULE_0__["ruleSets"];
    }
    show(room) {
        const newGameModal = this.newGameModal, zone = this.zone;
        zone.run(() => {
            this.roomId = room.roomId;
            newGameModal.show();
        });
    }
    hide() {
        const newGameModal = this.newGameModal, zone = this.zone;
        zone.run(() => {
            this.roomId = null;
            newGameModal.hide();
        });
    }
    async newGame() {
        const gameService = this.gameService, roomId = this.roomId, ruleSet = this.ruleSet;
        this.hide();
        await gameService.newGame(roomId, ruleSet);
    }
}



/***/ }),

/***/ "./src/client/navigation.component.ngfactory.js":
/*!******************************************************!*\
  !*** ./src/client/navigation.component.ngfactory.js ***!
  \******************************************************/
/*! exports provided: RenderType_NavigationComponent, View_NavigationComponent_0, View_NavigationComponent_Host_0, NavigationComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_NavigationComponent", function() { return RenderType_NavigationComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_NavigationComponent_0", function() { return View_NavigationComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_NavigationComponent_Host_0", function() { return View_NavigationComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationComponentNgFactory", function() { return NavigationComponentNgFactory; });
/* harmony import */ var _navigation_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navigation.component.scss.shim.ngstyle */ "./src/client/navigation.component.scss.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _navigation_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./navigation.component */ "./src/client/navigation.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _navigation.component.scss.shim.ngstyle,_angular_core,_.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_angular_common,_navigation.component,_room.service PURE_IMPORTS_END */








var styles_NavigationComponent = [_navigation_component_scss_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_NavigationComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({
    encapsulation: 0,
    styles: styles_NavigationComponent,
    data: {}
});

function View_NavigationComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "li", [["class", "nav-item"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 5, "a", [["class", "nav-link"], ["href", "javascript:"]], [[2, "active", null]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.setRoom(_v.context.$implicit) !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "span", [["class", "text-truncate"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "button", [["class", "close ml-2"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.leaveRoom(_v.context.$implicit) !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "fa-icon", [["class", "ng-fa-icon"], ["icon", "times"], ["size", "xs"], ["transform", "up-2"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]], {
            iconProp: [0, "iconProp"],
            size: [1, "size"],
            transform: [2, "transform"]
        }, null)], function (_ck, _v) {
        var currVal_3 = "times";
        var currVal_4 = "xs";
        var currVal_5 = "up-2";
        _ck(_v, 6, 0, currVal_3, currVal_4, currVal_5);
    }, function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = (_co.currentRoom == null ? null : _co.currentRoom.roomId) === _v.context.$implicit.roomId;
        _ck(_v, 1, 0, currVal_0);
        var currVal_1 = _v.context.$implicit.name;
        _ck(_v, 3, 0, currVal_1);
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 6).renderedIconHTML;
        _ck(_v, 5, 0, currVal_2);
    });
}
function View_NavigationComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 8, "nav", [["class", "navbar navbar-light bg-light justify-content-start pb-0"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "h1", [["class", "navbar-brand py-0"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["r\u00B3"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 5, "ul", [["class", "nav nav-tabs border-bottom"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "li", [["class", "nav-item"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "a", [["class", "nav-link"], ["href", "javascript:"]], [[2, "active", null]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if ("click" === en) {
                var pd_0 = _co.setRoom(null) !== false;
                ad = pd_0 && ad;
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Lobby"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_NavigationComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 802816, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], {
            ngForOf: [0, "ngForOf"]
        }, null)], function (_ck, _v) {
        var _co = _v.component;
        var currVal_1 = _co.rooms;
        _ck(_v, 8, 0, currVal_1);
    }, function (_ck, _v) {
        var _co = _v.component;
        var currVal_0 = !_co.currentRoom;
        _ck(_v, 5, 0, currVal_0);
    });
}
function View_NavigationComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "navigation", [], null, null, null, View_NavigationComponent_0, RenderType_NavigationComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 245760, null, 0, _navigation_component__WEBPACK_IMPORTED_MODULE_6__["NavigationComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_7__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var NavigationComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("navigation", _navigation_component__WEBPACK_IMPORTED_MODULE_6__["NavigationComponent"], View_NavigationComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/navigation.component.scss.shim.ngstyle.js":
/*!**************************************************************!*\
  !*** ./src/client/navigation.component.scss.shim.ngstyle.js ***!
  \**************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = ["nav[_ngcontent-%COMP%] { border-bottom: 1px solid #dee2e6; }\n\nnav[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%] { margin-bottom: -1px; }\n\nnav[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%] { overflow: hidden; height: 42px; }\n\nnav[_ngcontent-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%]   .text-truncate[_ngcontent-%COMP%] { display: inline-block; max-width: 160px; }"];




/***/ }),

/***/ "./src/client/navigation.component.ts":
/*!********************************************!*\
  !*** ./src/client/navigation.component.ts ***!
  \********************************************/
/*! exports provided: NavigationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationComponent", function() { return NavigationComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");


class NavigationComponent {
    constructor(roomService) {
        this.roomService = roomService;
        this.rooms = [];
        this.currentRoom = null;
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
    }
    ngOnInit() {
        const destroyed = this.destroyed, roomService = this.roomService;
        roomService.getJoinedRooms().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(rooms => {
            this.rooms = rooms;
        });
        roomService.getCurrentRoom().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(room => {
            this.currentRoom = room;
        });
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
    async setRoom(room) {
        const roomService = this.roomService;
        await roomService.setRoom(room);
    }
    async leaveRoom({ roomId }) {
        const roomService = this.roomService;
        await roomService.leaveRoom(roomId);
    }
}



/***/ }),

/***/ "./src/client/polyfills.ts":
/*!*********************************!*\
  !*** ./src/client/polyfills.ts ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reflect_metadata__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var zone_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! zone.js */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(zone_js__WEBPACK_IMPORTED_MODULE_1__);





/***/ }),

/***/ "./src/client/r3.component.ngfactory.js":
/*!**********************************************!*\
  !*** ./src/client/r3.component.ngfactory.js ***!
  \**********************************************/
/*! exports provided: RenderType_R3Component, View_R3Component_0, View_R3Component_Host_0, R3ComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_R3Component", function() { return RenderType_R3Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_R3Component_0", function() { return View_R3Component_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_R3Component_Host_0", function() { return View_R3Component_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "R3ComponentNgFactory", function() { return R3ComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lobby_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lobby.component.ngfactory */ "./src/client/lobby.component.ngfactory.js");
/* harmony import */ var _lobby_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lobby.component */ "./src/client/lobby.component.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/* harmony import */ var _room_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./room.component.ngfactory */ "./src/client/room.component.ngfactory.js");
/* harmony import */ var _room_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./room.component */ "./src/client/room.component.ts");
/* harmony import */ var _navigation_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./navigation.component.ngfactory */ "./src/client/navigation.component.ngfactory.js");
/* harmony import */ var _navigation_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation.component */ "./src/client/navigation.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory */ "./node_modules/@fortawesome/angular-fontawesome/angular-fontawesome.ngfactory.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _r3_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./r3.component */ "./src/client/r3.component.ts");
/* harmony import */ var _game_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./game.service */ "./src/client/game.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_lobby.component.ngfactory,_lobby.component,_room.service,_room.component.ngfactory,_room.component,_navigation.component.ngfactory,_navigation.component,_angular_common,_.._node_modules__fortawesome_angular_fontawesome_angular_fontawesome.ngfactory,_fortawesome_angular_fontawesome,_angular_platform_browser,_r3.component,_game.service PURE_IMPORTS_END */














var styles_R3Component = [];
var RenderType_R3Component = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({
    encapsulation: 2,
    styles: styles_R3Component,
    data: {}
});

function View_R3Component_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "lobby", [], null, null, null, _lobby_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_LobbyComponent_0"], _lobby_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_LobbyComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 245760, null, 0, _lobby_component__WEBPACK_IMPORTED_MODULE_2__["LobbyComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_3__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
function View_R3Component_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "room", [], null, null, null, _room_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_RoomComponent_0"], _room_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_RoomComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 49152, null, 0, _room_component__WEBPACK_IMPORTED_MODULE_5__["RoomComponent"], [], null, null)], null, null);
}
function View_R3Component_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "navigation", [], null, null, null, _navigation_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_NavigationComponent_0"], _navigation_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_NavigationComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 245760, null, 0, _navigation_component__WEBPACK_IMPORTED_MODULE_7__["NavigationComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_3__["RoomService"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 4, "div", [["class", "container my-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_R3Component_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_R3Component_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](6, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], {
            ngIf: [0, "ngIf"]
        }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, null, 7, "footer", [["class", "container d-flex justify-content-end fixed-bottom my-2"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](8, 0, null, null, 1, "a", [["class", "mx-4"], ["href", "https://jovalent.com"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Jovalent.com"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](10, 0, null, null, 4, "a", [["class", "ml-4"], ["href", "https://twitter.com/JovalentStudios"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](11, 0, null, null, 2, "fa-icon", [["class", "ng-fa-icon"]], [[8, "innerHTML", 1]], null, null, _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_9__["View_FaIconComponent_0"], _node_modules_fortawesome_angular_fontawesome_angular_fontawesome_ngfactory__WEBPACK_IMPORTED_MODULE_9__["RenderType_FaIconComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](12, 573440, null, 0, _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__["FaIconComponent"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["DomSanitizer"]], {
            iconProp: [0, "iconProp"]
        }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵpad"](13, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" @JovalentStudios "]))], function (_ck, _v) {
        var _co = _v.component;
        _ck(_v, 1, 0);
        var currVal_0 = !_co.currentRoom;
        _ck(_v, 4, 0, currVal_0);
        var currVal_1 = _co.currentRoom;
        _ck(_v, 6, 0, currVal_1);
        var currVal_3 = _ck(_v, 13, 0, "fab", "twitter");
        _ck(_v, 12, 0, currVal_3);
    }, function (_ck, _v) {
        var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 12).renderedIconHTML;
        _ck(_v, 11, 0, currVal_2);
    });
}
function View_R3Component_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "r3", [], null, null, null, View_R3Component_0, RenderType_R3Component)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 4440064, null, 0, _r3_component__WEBPACK_IMPORTED_MODULE_12__["R3Component"], [_game_service__WEBPACK_IMPORTED_MODULE_13__["GameService"], _room_service__WEBPACK_IMPORTED_MODULE_3__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 1, 0);
    }, null);
}
var R3ComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("r3", _r3_component__WEBPACK_IMPORTED_MODULE_12__["R3Component"], View_R3Component_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/r3.component.ts":
/*!************************************!*\
  !*** ./src/client/r3.component.ts ***!
  \************************************/
/*! exports provided: R3Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "R3Component", function() { return R3Component; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");


class R3Component {
    constructor(// HACK: if we don't initialize this service before joining a room, there's a race condition
    //       where we may not be listening in time for the first update event.
    gameService, roomService) {
        this.gameService = gameService;
        this.roomService = roomService;
        this.currentRoom = null;
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
    }
    ngOnInit() {
        const destroyed = this.destroyed, roomService = this.roomService;
        roomService.getCurrentRoom().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(room => {
            this.currentRoom = room;
        });
    }
    ngAfterViewInit() {
        const destroyed = this.destroyed, keys = ['Backspace', ' '], codes = ['Backspace', 'Space'], inputs = ['INPUT', 'TEXTAREA', 'SELECT'];
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('keydown', 'keypress').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(evtName => Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(document, evtName, {
            capture: false
        })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])(e => keys.includes(e.key) || codes.includes(e.code)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])(e => {
            const _document = document, activeElement = _document.activeElement, target = e.srcElement || e.target;
            return activeElement === document.body || activeElement === document.documentElement || !target || !inputs.includes(target.tagName || target.nodeName) || target.disabled || target.readOnly;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(e => {
            e.cancelBubble = true;
            e.returnValue = false;
            e.stopPropagation();
            e.preventDefault();
        });
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
}



/***/ }),

/***/ "./src/client/room.component.ngfactory.js":
/*!************************************************!*\
  !*** ./src/client/room.component.ngfactory.js ***!
  \************************************************/
/*! exports provided: RenderType_RoomComponent, View_RoomComponent_0, View_RoomComponent_Host_0, RoomComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_RoomComponent", function() { return RenderType_RoomComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_RoomComponent_0", function() { return View_RoomComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_RoomComponent_Host_0", function() { return View_RoomComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoomComponentNgFactory", function() { return RoomComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _game_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game.component.ngfactory */ "./src/client/game.component.ngfactory.js");
/* harmony import */ var _game_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game.component */ "./src/client/game.component.ts");
/* harmony import */ var _game_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game.service */ "./src/client/game.service.ts");
/* harmony import */ var _room_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./room.service */ "./src/client/room.service.ts");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-zone-scheduler/dist/zone-scheduler */ "./node_modules/ngx-zone-scheduler/dist/zone-scheduler.js");
/* harmony import */ var ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _chat_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chat.component.ngfactory */ "./src/client/chat.component.ngfactory.js");
/* harmony import */ var _chat_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chat.component */ "./src/client/chat.component.ts");
/* harmony import */ var _room_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./room.component */ "./src/client/room.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_game.component.ngfactory,_game.component,_game.service,_room.service,ngx_zone_scheduler_dist_zone_scheduler,_chat.component.ngfactory,_chat.component,_room.component PURE_IMPORTS_END */









var styles_RoomComponent = [];
var RenderType_RoomComponent = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({
    encapsulation: 2,
    styles: styles_RoomComponent,
    data: {}
});

function View_RoomComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 4, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "game", [["class", "col-lg-5 col-sm-6 col-12"]], null, null, null, _game_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_GameComponent_0"], _game_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_GameComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 245760, null, 0, _game_component__WEBPACK_IMPORTED_MODULE_2__["GameComponent"], [_game_service__WEBPACK_IMPORTED_MODULE_3__["GameService"], _room_service__WEBPACK_IMPORTED_MODULE_4__["RoomService"], ngx_zone_scheduler_dist_zone_scheduler__WEBPACK_IMPORTED_MODULE_5__["ZoneScheduler"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 1, "chat", [["class", "col-lg-7 col-sm-6 col-12"]], null, null, null, _chat_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ChatComponent_0"], _chat_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ChatComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 114688, null, 0, _chat_component__WEBPACK_IMPORTED_MODULE_7__["ChatComponent"], [_room_service__WEBPACK_IMPORTED_MODULE_4__["RoomService"]], null, null)], function (_ck, _v) {
        _ck(_v, 2, 0);
        _ck(_v, 4, 0);
    }, null);
}
function View_RoomComponent_Host_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "room", [], null, null, null, View_RoomComponent_0, RenderType_RoomComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 49152, null, 0, _room_component__WEBPACK_IMPORTED_MODULE_8__["RoomComponent"], [], null, null)], null, null);
}
var RoomComponentNgFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("room", _room_component__WEBPACK_IMPORTED_MODULE_8__["RoomComponent"], View_RoomComponent_Host_0, {}, {}, []);




/***/ }),

/***/ "./src/client/room.component.ts":
/*!**************************************!*\
  !*** ./src/client/room.component.ts ***!
  \**************************************/
/*! exports provided: RoomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoomComponent", function() { return RoomComponent; });
class RoomComponent {
}



/***/ }),

/***/ "./src/client/room.service.ts":
/*!************************************!*\
  !*** ./src/client/room.service.ts ***!
  \************************************/
/*! exports provided: RoomService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoomService", function() { return RoomService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");


class RoomService {
    constructor(scheduler, sessionService) {
        this.scheduler = scheduler;
        this.sessionService = sessionService;
        this.allMessages = new rxjs__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](10);
        this.allRooms = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"]([]);
        this.joinedRoomIds = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"]([]);
        this.joinedRooms = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"]([]);
        this.currentRoom = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](null);
        sessionService.getEvents('rooms').subscribe(rooms => {
            const allRooms = this.allRooms;
            allRooms.next(rooms);
        });
        sessionService.getEvents('joinedRooms').subscribe(roomIds => {
            const joinedRoomIds = this.joinedRoomIds;
            joinedRoomIds.next(roomIds);
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["combineLatest"])(this.joinedRoomIds, this.allRooms, (roomIds, rooms) => {
            const joinedRooms = rooms.filter(r => roomIds.includes(r.roomId)), currentRoom = this.currentRoom.getValue();
            if (currentRoom) {
                this.currentRoom.next(joinedRooms.filter(j => j.roomId === currentRoom.roomId)[0] || null);
            }
            return joinedRooms;
        }).subscribe(joinedRooms => {
            this.joinedRooms.next(joinedRooms);
        });
        sessionService.getEvents('message').subscribe(message => {
            const allMessages = this.allMessages;
            allMessages.next(message);
        });
    }
    getRooms() {
        const allRooms = this.allRooms, scheduler = this.scheduler;
        return allRooms.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
    async sendMessage(roomId, message) {
        const sessionService = this.sessionService;
        await sessionService.emit('sendMessage', {
            roomId,
            message
        });
    }
    getMessages() {
        const allMessages = this.allMessages, scheduler = this.scheduler;
        return allMessages.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["scan"])((arr, val) => [...arr, val], []), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
    getJoinedRooms() {
        const joinedRooms = this.joinedRooms, scheduler = this.scheduler;
        return joinedRooms.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
    async joinRoom(room, password) {
        const sessionService = this.sessionService, currentRoom = this.currentRoom, roomId = room.roomId;
        await sessionService.emit('joinRoom', {
            roomId,
            password
        });
        currentRoom.next(room);
    }
    async leaveRoom(roomId) {
        const sessionService = this.sessionService;
        await sessionService.emit('leaveRoom', {
            roomId
        });
    }
    async createRoom(name, password) {
        const currentRoom = this.currentRoom, sessionService = this.sessionService;
        const room = await sessionService.emit('createRoom', {
            name,
            password
        });
        currentRoom.next(room);
        return room;
    }
    async setRoom(room) {
        const currentRoom = this.currentRoom;
        if (room) {
            const roomId = room.roomId, joinedRooms = this.joinedRooms.getValue();
            if (!joinedRooms.some(r => r.roomId === roomId)) {
                throw new Error('Room is not joined.');
            }
            currentRoom.next(room);
        }
        else {
            currentRoom.next(null);
        }
    }
    getCurrentRoom() {
        const currentRoom = this.currentRoom, scheduler = this.scheduler;
        return currentRoom.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
}



/***/ }),

/***/ "./src/client/session.service.ts":
/*!***************************************!*\
  !*** ./src/client/session.service.ts ***!
  \***************************************/
/*! exports provided: SessionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionService", function() { return SessionService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_2__);



class SessionService {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        const destroyed = this.destroyed;
        const socket = this.socket = socket_io_client__WEBPACK_IMPORTED_MODULE_2___default.a.connect('/', {
            transports: ['websocket', 'polling'],
            upgrade: false
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('connect').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(e => Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(socket, e)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(console.log.bind(console));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('error', 'connect_error', 'reconnect_error').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(e => Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(socket, e)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(destroyed)).subscribe(console.error.bind(console));
        destroyed.subscribe(() => {
            socket.close();
        });
    }
    getEvents(message) {
        const socket = this.socket, scheduler = this.scheduler;
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(socket, message).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["observeOn"])(scheduler));
    }
    emit(message, data = {}) {
        const socket = this.socket;
        return new Promise((resolve, reject) => {
            socket.emit(message, data, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }
    ngOnDestroy() {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
}



/***/ }),

/***/ "./src/client/vendor.ts":
/*!******************************!*\
  !*** ./src/client/vendor.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _font_awesome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./font-awesome */ "./src/client/font-awesome.ts");





/***/ }),

/***/ "./src/data/colors.yaml":
/*!******************************!*\
  !*** ./src/data/colors.yaml ***!
  \******************************/
/*! exports provided: colors, default */
/***/ (function(module) {

module.exports = {"colors":{"aqua":{"displayName":"Aqua","color":[180,90,55]},"black":{"displayName":"Black","color":[0,0,0]},"blue":{"displayName":"Blue","color":[240,90,55]},"fuschsia":{"displayName":"Fuchsia","color":[300,90,55]},"gray":{"displayName":"Gray","color":[0,0,55]},"green":{"displayName":"Green","color":[120,90,55]},"orange":{"displayName":"Orange","color":[30,90,55]},"pink":{"displayName":"Pink","color":[330,90,55]},"purple":{"displayName":"Purple","color":[270,90,55]},"red":{"displayName":"Red","color":[0,90,55]},"white":{"displayName":"White","color":[0,0,100]},"yellow":{"displayName":"Yellow","color":[55,90,55]}}};

/***/ }),

/***/ "./src/grid.ts":
/*!*********************!*\
  !*** ./src/grid.ts ***!
  \*********************/
/*! exports provided: Grid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Grid", function() { return Grid; });
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ "./node_modules/core-js/modules/es7.symbol.async-iterator.js");
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.symbol */ "./node_modules/core-js/modules/es6.symbol.js");
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_2__);



function validate(grid, { x, y }) {
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
        throw new Error(`(${x}, ${y}) is not valid`);
    }
    if (!grid.boundsCheck({
        x,
        y
    })) {
        throw new Error(`(${x}, ${y}) is out of bounds`);
    }
}
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Map();
    }
    boundsCheck({ x, y }) {
        const width = this.width, height = this.height;
        return x >= 0 && x < width && y >= 0 && y < height;
    }
    get({ x, y }) {
        validate(this, {
            x,
            y
        });
        const key = JSON.stringify({
            x,
            y
        });
        return this.data.get(key);
    }
    set({ x, y }, value) {
        validate(this, {
            x,
            y
        });
        const key = JSON.stringify({
            x,
            y
        });
        this.data.set(key, value);
    }
    [Symbol.iterator]() {
        function* iterator() {
            const width = this.width, height = this.height;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    yield this.get({
                        x,
                        y
                    });
                }
            }
        }
        return iterator.call(this);
    }
}



/***/ }),

/***/ "./src/rule-sets.ts":
/*!**************************!*\
  !*** ./src/rule-sets.ts ***!
  \**************************/
/*! exports provided: rulesStandard, rulesReversed, ruleSets, ruleSetMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rulesStandard", function() { return rulesStandard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rulesReversed", function() { return rulesReversed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ruleSets", function() { return ruleSets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ruleSetMap", function() { return ruleSetMap; });
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board */ "./src/board.ts");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; }));
    }
    ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); });
} return target; }
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }

const directions = [{
        x: 0,
        y: -1
    }, {
        x: 1,
        y: -1
    }, {
        x: 1,
        y: 0
    }, {
        x: 1,
        y: 1
    }, {
        x: 0,
        y: 1
    }, {
        x: -1,
        y: 1
    }, {
        x: -1,
        y: 0
    }, {
        x: -1,
        y: -1
    }];
function getAffectedSquares(board, position, color) {
    if (!board.boundsCheck(position)) {
        return [];
    }
    const square = board.get(position);
    if (!square || !square.empty || !square.enabled) {
        return [];
    }
    function direction({ x, y }, delta) {
        const squares = [];
        for (;;) {
            x += delta.x;
            y += delta.y;
            if (!board.boundsCheck({
                x,
                y
            })) {
                return [];
            }
            const square = board.get({
                x,
                y
            });
            if (!square || square.empty || !square.enabled) {
                return [];
            }
            if (square.color === color) {
                return squares;
            }
            squares.push(square);
        }
    }
    let squares = [square];
    for (const delta of directions) {
        squares = [...squares, ...direction(position, delta)];
    }
    if (squares.length <= 1) {
        return [];
    }
    return squares;
}
class RulesStandard {
    constructor() {
        this.name = 'Standard';
        this.ruleSet = "standard";
        this.colors = 2;
        this.boardSize = Object.freeze({
            width: 8,
            height: 8
        });
    }
    isValid(game, gameState, position, color) {
        return getAffectedSquares(_board__WEBPACK_IMPORTED_MODULE_1__["Board"].fromGame(game, gameState), position, color).length > 0;
    }
    compareScores(score1, score2) {
        return score1 - score2;
    }
    getValidMoves(game, gameState, color) {
        const points = [];
        const _game$size = game.size, width = _game$size.width, height = _game$size.height;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const point = {
                    x,
                    y
                };
                if (this.isValid(game, gameState, point, color))
                    points.push(point);
            }
        }
        return points;
    }
    isGameOver(game, gameState) {
        const colors = this.colors;
        for (let color = 0; color < colors; ++color) {
            if (this.getValidMoves(game, gameState, color).length > 0)
                return false;
        }
        return true;
    }
    makeMove(game, gameState, position) {
        const prevTurn = gameState.turn, prevIndex = gameState.index;
        const board = _board__WEBPACK_IMPORTED_MODULE_1__["Board"].fromGame(game, gameState);
        const squares = getAffectedSquares(board, position, prevTurn);
        if (squares.length === 0)
            return null;
        for (const square of squares) {
            square.color = prevTurn;
        }
        const index = prevIndex + 1;
        const lastMove = Object.freeze(_objectSpread({}, position));
        const data = board.getData();
        const colors = this.colors;
        let turn = null;
        for (let i = 0; i < colors; ++i) {
            const t = (prevTurn + 1 + i) % colors;
            if (this.getValidMoves(game, {
                turn: t,
                index,
                data,
                lastMove
            }, t).length > 0) {
                turn = t;
                break;
            }
        }
        return {
            turn,
            index,
            data,
            lastMove
        };
    }
    getScore(game, gameState, color) {
        const board = _board__WEBPACK_IMPORTED_MODULE_1__["Board"].fromGame(game, gameState);
        let score = 0;
        for (const square of board) {
            if (square && square.enabled && square.color === color) {
                ++score;
            }
        }
        return score;
    }
    newGame(gameId) {
        const boardSize = this.boardSize;
        const board = new _board__WEBPACK_IMPORTED_MODULE_1__["Board"]();
        board.reset(boardSize); // TODO: center? gets ugly with an odd dimension
        board.get({
            x: 3,
            y: 3
        }).color = 0;
        board.get({
            x: 4,
            y: 3
        }).color = 1;
        board.get({
            x: 3,
            y: 4
        }).color = 1;
        board.get({
            x: 4,
            y: 4
        }).color = 0;
        const gameStates = [{
                turn: 0,
                index: 0,
                data: board.getData(),
                lastMove: null
            }];
        return {
            gameId,
            ruleSet: this.ruleSet,
            mask: board.getMask(),
            colors: Object.freeze(['black', 'white']),
            size: Object.freeze(_objectSpread({}, boardSize)),
            gameStates: Object.freeze(gameStates)
        };
    }
}
class RulesReversed extends RulesStandard {
    constructor() {
        super(...arguments);
        this.name = 'Reversed';
        this.ruleSet = "reversed";
    }
    compareScores(score1, score2) {
        return score2 - score1;
    }
}
const rulesStandard = new RulesStandard();
const rulesReversed = new RulesReversed();
const ruleSets = [rulesStandard, rulesReversed];
const ruleSetMap = new Map();
for (const ruleSet of ruleSets) {
    ruleSetMap.set(ruleSet.ruleSet, ruleSet);
}



/***/ }),

/***/ "./src/square.ts":
/*!***********************!*\
  !*** ./src/square.ts ***!
  \***********************/
/*! exports provided: Square */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Square", function() { return Square; });
class Square {
    constructor(position, bounds) {
        this.position = position;
        this.bounds = bounds;
        this.enabled = true;
        this.color = null;
    }
    get empty() {
        return this.color === null;
    }
}



/***/ }),

/***/ 1:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[["./src/client/main.ts","runtime~client","vendors~client"]]]);
//# sourceMappingURL=client.js.map
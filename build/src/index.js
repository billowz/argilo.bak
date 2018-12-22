/**
 *
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @module main
 * @preferred
 * @created Wed Nov 21 2018 10:21:20 GMT+0800 (China Standard Time)
 * @modified Fri Dec 21 2018 10:32:10 GMT+0800 (China Standard Time)
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./utility"));
function watch() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (target, propertyKey) {
        target[propertyKey].watched = args;
    };
}
function watch2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (target, propertyKey) {
    };
}
var A = /** @class */ (function () {
    function A() {
    }
    A.prototype.a = function () { };
    __decorate([
        watch2('abc')
    ], A.prototype, "b");
    __decorate([
        watch('abc')
    ], A.prototype, "a");
    return A;
}());
exports.A = A;
//# sourceMappingURL=index.js.map
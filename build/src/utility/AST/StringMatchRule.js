/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 17:07:25 GMT+0800 (China Standard Time)
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var RegMatchRule_1 = require("./RegMatchRule");
var reg_1 = require("../reg");
var mixin_1 = require("../mixin");
var StringMatchRule = /** @class */ (function (_super) {
    __extends(StringMatchRule, _super);
    function StringMatchRule(name, str, ignoreCase, capturable, onMatch, onErr) {
        var _this = _super.call(this, name, new RegExp(reg_1.reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), capturable, onMatch, onErr) || this;
        _this.setExpr(str);
        return _this;
    }
    StringMatchRule = __decorate([
        mixin_1.mixin({ type: 'String' })
    ], StringMatchRule);
    return StringMatchRule;
}(RegMatchRule_1.RegMatchRule));
exports.StringMatchRule = StringMatchRule;
//# sourceMappingURL=StringMatchRule.js.map
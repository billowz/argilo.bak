/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 16:09:42 GMT+0800 (China Standard Time)
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
var MatchRule_1 = require("./MatchRule");
var reg_1 = require("../reg");
var is_1 = require("../is");
var fn_1 = require("../fn");
var collection_1 = require("../collection");
var mixin_1 = require("../mixin");
var create_1 = require("../create");
/**
 * match string by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 */
var RegMatchRule = /** @class */ (function (_super) {
    __extends(RegMatchRule, _super);
    /**
     * @param name 			match name
     * @param regexp		regular
     * @param pick			pick regular matching results
     * 						    0: pick results[0] (optimize: test and substring in sticky mode)
     * 						  > 0: pick results[{pick}]
     * 						  < 0: pick first non-blank string from 1 to -{pick} index on results
     * 						 true: pick results
     * 						false: not pick result, result is null (optimize: just test string in sticky mode)
     * @param start			start character codes in the regular, optimize performance by start character codes
     * @param capturable	error is capturable
     * @param onMatch		match callback
     * @param onErr			error callback
     */
    function RegMatchRule(name, regexp, pick, start, capturable, onMatch, onErr) {
        var _this = this;
        pick = pick === false || is_1.isInt(pick) ? pick : !!pick || 0;
        var sticky = reg_1.regStickySupport && !pick, // use exec mode when need pick match group data
        pattern = regexp.source, ignoreCase = regexp.ignoreCase;
        // always wrapping in a none capturing group preceded by '^' to make sure
        // matching can only work on start of input. duplicate/redundant start of
        // input markers have no meaning (/^^^^A/ === /^A/)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
        // When the y flag is used with a pattern, ^ always matches only at the
        // beginning of the input, or (if multiline is true) at the beginning of a
        // line.
        regexp = new RegExp(sticky ? pattern : "^(?:" + pattern + ")", (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''));
        _this = _super.call(this, name, start, ignoreCase, capturable, onMatch, onErr) || this;
        _this.regexp = regexp;
        _this.pick = pick;
        _this.match = sticky ? _this.stickyMatch : _this.execMatch;
        sticky ? (_this.spicker = pick === false ? pickNone : pickTestStr) : (_this.picker = mkPicker(pick));
        _this.setExpr(pattern);
        return _this;
    }
    /**
     * match on sticky mode
     */
    RegMatchRule.prototype.stickyMatch = function (context) {
        var reg = this.regexp, buff = context.getBuff(), start = context.getOffset();
        reg.lastIndex = start;
        var end;
        return reg.test(buff)
            ? ((end = reg.lastIndex), this.comsume(this.spicker(buff, start, end), end - start, context))
            : this.error(this.EXPECT, context);
    };
    /**
     * match on exec mode
     */
    RegMatchRule.prototype.execMatch = function (context) {
        var m = this.regexp.exec(context.getBuff(true));
        return m ? this.comsume(this.picker(m), m[0].length, context) : this.error(this.EXPECT, context);
    };
    RegMatchRule = __decorate([
        mixin_1.mixin({ type: 'RegExp' })
    ], RegMatchRule);
    return RegMatchRule;
}(MatchRule_1.MatchRule));
exports.RegMatchRule = RegMatchRule;
var cache = create_1.create(null);
function mkPicker(pick) {
    return (cache[pick] ||
        (cache[pick] =
            pick === false
                ? pickNone
                : pick === true
                    ? pickAll
                    : pick >= 0
                        ? fn_1.createFn("return m[" + pick + "]", ['m'], "pick_" + pick)
                        : fn_1.createFn("return " + collection_1.mapArray(new Array(-pick), function (v, i) { return "m[" + (i + 1) + "]"; }).join(' || '), ['m'], "pick_1_" + -pick)));
}
function pickNone() {
    return null;
}
function pickAll(m) {
    return m;
}
function pickTestStr(buff, start, end) {
    return buff.substring(start, end);
}
//# sourceMappingURL=RegMatchRule.js.map
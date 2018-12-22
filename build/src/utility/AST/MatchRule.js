/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 18:57:32 GMT+0800 (China Standard Time)
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
exports.__esModule = true;
var Rule_1 = require("./Rule");
/**
 * Match Rule Interface
 */
var MatchRule = /** @class */ (function (_super) {
    __extends(MatchRule, _super);
    /**
     * @param name 			match name
     * @param start 		start char codes, prepare test by start char codes before match
     * @param ignoreCase	ignore case for the start char codes
     * @param capturable	error is capturable
     * @param onMatch		match callback
     * @param onErr			error callback
     */
    function MatchRule(name, start, ignoreCase, capturable, onMatch, onErr) {
        var _this = _super.call(this, name, capturable, onMatch, onErr) || this;
        _this.ignoreCase = ignoreCase;
        _this.setStartCodes(start, ignoreCase);
        return _this;
    }
    /**
     * consume matched result
     * @param data 		matched result
     * @param len 		matched chars
     * @param context 	match context
     */
    MatchRule.prototype.comsume = function (data, len, context) {
        context.advance(len);
        return this.matched(data, len, context);
    };
    return MatchRule;
}(Rule_1.Rule));
exports.MatchRule = MatchRule;
//# sourceMappingURL=MatchRule.js.map
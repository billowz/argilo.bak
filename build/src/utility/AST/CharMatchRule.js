/**
 *
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 15:51:47 GMT+0800 (China Standard Time)
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
var MatchRule_1 = require("./MatchRule");
var string_1 = require("../string");
/**
 * match a character in the allowed list
 * > well match any character if the allowed list is empty
 *
 * > must call test() before match
 */
var CharMatchRule = /** @class */ (function (_super) {
    __extends(CharMatchRule, _super);
    /**
     * @param name 			match name
     * @param allows 		allowed character codes for match
     * 						well match any character if the allowed list is empty
     * @param ignoreCase	ignore case for the allowed character codes
     * @param capturable	error is capturable
     * @param onMatch		match callback
     * @param onErr			error callback
     */
    function CharMatchRule(name, allows, ignoreCase, capturable, onMatch, onErr) {
        var _this = _super.call(this, name, allows, ignoreCase, capturable, onMatch, onErr) || this;
        _this.type = 'Character';
        var codes = _this.startCodes;
        var i = codes.length, expr = '*';
        if (i) {
            var chars = [];
            while (i--)
                chars[i] = string_1.char(codes[i]);
            expr = "\"" + chars.join('" | "') + "\"";
        }
        _this.setExpr(expr);
        return _this;
    }
    CharMatchRule.prototype.match = function (context) {
        return this.comsume(context.nextChar(), 1, context);
    };
    return CharMatchRule;
}(MatchRule_1.MatchRule));
exports.CharMatchRule = CharMatchRule;
//# sourceMappingURL=CharMatchRule.js.map
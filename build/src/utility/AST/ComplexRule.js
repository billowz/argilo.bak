/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 15:29:24 GMT+0800 (China Standard Time)
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
var MatchContext_1 = require("./MatchContext");
var assert_1 = require("../assert");
var collection_1 = require("../collection");
var format_1 = require("../format");
var string_1 = require("../string");
var Source_1 = require("../Source");
/**
 * Abstract Complex Rule
 */
var ComplexRule = /** @class */ (function (_super) {
    __extends(ComplexRule, _super);
    /**
     * @param name 			match name
     * @param builder 		callback of build rules
     * @param capturable	error is capturable
     * @param onMatch		match callback
     * @param onErr			error callback
     */
    function ComplexRule(name, repeat, builder, capturable, onMatch, onErr) {
        var _this = _super.call(this, name, capturable, onMatch, onErr) || this;
        _this.builder = builder;
        if (!(repeat[0] >= 0))
            repeat[0] = 0;
        if (!(repeat[1] > 0))
            repeat[1] = 1e5;
        assert_1.assert.notGreater(repeat[0], repeat[1]);
        _this.repeat = [repeat[0], repeat[1]];
        if (repeat[0] !== repeat[1] || repeat[0] !== 1) {
            _this.match = _this.repeatMatch;
            _this.type = _this.type + "[" + repeat[0] + (repeat[0] === repeat[1] ? '' : " - " + (repeat[1] === 1e5 ? 'MAX' : repeat[1])) + "]";
        }
        return _this;
    }
    ComplexRule.prototype.parse = function (buff, errSource) {
        var ctx = new MatchContext_1.MatchContext(new Source_1.Source(buff), buff, 0, 0);
        var err = this.match(ctx);
        if (err) {
            var msg = [];
            var pos;
            do {
                pos = err.position();
                msg.unshift("[" + format_1.pad(String(pos[0]), 3) + ":" + format_1.pad(String(pos[1]), 2) + "] - " + err.rule.toString() + ": " + err.msg + " on \"" + string_1.escapeStr(pos[2]) + "\"");
            } while ((err = err.source));
            if (errSource !== false)
                msg.push('[Source]', ctx.source.source());
            throw new SyntaxError(msg.join('\n'));
        }
        return ctx.data;
    };
    ComplexRule.prototype.repeatMatch = function (context) {
        return assert_1.assert();
    };
    ComplexRule.prototype.init = function () {
        var rules = this.builder(this);
        var i = rules && rules.length;
        assert_1.assert.is(i, "Require Complex Rules");
        this.rules = rules;
        var names = this.rnames(rules);
        this.setExpr(names.join(this.split));
        while (i--)
            names[i] = "Expect[" + i + "]: " + names[i];
        this.EXPECTS = names;
        this.__init(rules);
        this.builder = null;
        return this;
    };
    ComplexRule.prototype.__init = function (rules) { };
    ComplexRule.prototype.setCodeIdx = function (index) {
        this.repeat[0] && _super.prototype.setCodeIdx.call(this, index);
    };
    ComplexRule.prototype.getRules = function () {
        return this.rules || (this.init(), this.rules);
    };
    ComplexRule.prototype.getStart = function (stack) {
        var _a = this, id = _a.id, startCodes = _a.startCodes;
        return startCodes
            ? startCodes
            : (stack && ~collection_1.idxOfArray(stack, id)) || this.rules
                ? []
                : (this.init(), this.startCodes);
    };
    ComplexRule.prototype.consume = function (context) {
        var err = this.matched(context.data, context.len(), context.parent);
        !err && context.commit();
        return err;
    };
    ComplexRule.prototype.rnames = function (rules, stack) {
        var i = rules.length;
        var names = new Array(i), id = this.id;
        while (i--)
            names[i] = rules[i].getExpr(stack ? stack.concat(id) : [id]);
        return names;
    };
    ComplexRule.prototype.getExpr = function (stack) {
        var _a = this, id = _a.id, name = _a.name;
        var i;
        return name
            ? name
            : stack
                ? ((i = collection_1.idxOfArray(stack, id)), ~i)
                    ? "<" + this.type + " -> $" + stack[i] + ">"
                    : this.mkExpr(this.rnames(this.getRules(), stack).join(this.split))
                : this.expr;
    };
    return ComplexRule;
}(Rule_1.Rule));
exports.ComplexRule = ComplexRule;
//# sourceMappingURL=ComplexRule.js.map
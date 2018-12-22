/**
 *
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 17:05:13 GMT+0800 (China Standard Time)
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
var ComplexRule_1 = require("./ComplexRule");
var mixin_1 = require("../mixin");
/**
 * AND Complex Rule
 *
 */
var AndRule = /** @class */ (function (_super) {
    __extends(AndRule, _super);
    function AndRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AndRule.prototype.__init = function (rules) {
        this.setStartCodes(rules[0].getStart([this.id]));
    };
    AndRule.prototype.match = function (context) {
        var rules = this.getRules(), len = rules.length, ctx = context.create();
        var err, i = 0;
        for (; i < len; i++)
            if ((err = this.testRule(rules[i], i, ctx)))
                return err;
        return this.consume(ctx);
    };
    AndRule.prototype.repeatMatch = function (context) {
        var rules = this.getRules(), len = rules.length, _a = this.repeat, min = _a[0], max = _a[1], ctx = context.create();
        var err, repeat = 0, i, mlen, dlen;
        out: for (; repeat < max; repeat++) {
            dlen = ctx.dataLen();
            mlen = ctx.len();
            for (i = 0; i < len; i++) {
                if ((err = this.testRule(rules[i], i, ctx))) {
                    if (repeat < min)
                        return err;
                    ctx.reset(mlen, dlen);
                    break out;
                }
            }
        }
        return this.consume(ctx);
    };
    AndRule.prototype.testRule = function (rule, i, ctx) {
        var err;
        if (!rule.test(ctx)) {
            return this.error(this.EXPECTS[i], ctx);
        }
        else if ((err = rule.match(ctx))) {
            return this.error(this.EXPECTS[i], ctx, err);
        }
        //return (!rule.test(ctx) || (err = rule.match(ctx))) && (err = this.error(this.EXPECTS[i], ctx, err))
    };
    AndRule = __decorate([
        mixin_1.mixin({ type: 'And', split: ' ' })
    ], AndRule);
    return AndRule;
}(ComplexRule_1.ComplexRule));
exports.AndRule = AndRule;
//# sourceMappingURL=AndRule.js.map
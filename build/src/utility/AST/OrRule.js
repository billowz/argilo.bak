/**
 *
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 15:54:57 GMT+0800 (China Standard Time)
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
var util_1 = require("./util");
var mixin_1 = require("../mixin");
/**
 * OR Complex Rule
 */
var OrRule = /** @class */ (function (_super) {
    __extends(OrRule, _super);
    function OrRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrRule.prototype.__init = function (rules) {
        var id = this.id;
        var len = rules.length, starts = [], // all distinct start codes
        rStarts = [], // start codes per rule
        index = [
            [] // rules which without start code
        ];
        var i, j, k, codes;
        // get start codes of all rules
        for (i = 0; i < len; i++) {
            rStarts[i] = []; // init rule start codes
            util_1.eachCharCodes(rules[i].getStart([id]), false, function (code) {
                rStarts[i].push(code); // append to rule start codes
                if (!index[code]) {
                    index[code] = []; // init start code index
                    starts.push(code); // append to all start codes
                }
            });
        }
        // fill index
        for (i = 0; i < len; i++) {
            codes = rStarts[i]; // append rule to start code index by rule start codes
            if (!codes.length) {
                // rule without start code
                index[0].push(rules[i]); // append rule to index[0]
                codes = starts; // append rule to start code index by all start codes
            }
            // append rule to start code index (by rule start codes or all start codes)
            j = codes.length;
            while (j--) {
                k = index[codes[j]];
                if (k.idx !== i) {
                    // deduplication
                    k.push(rules[i]); // append rules[i] to start code index[codes[j]]
                    k.idx = i;
                }
            }
        }
        // rule have unkown start code when got unkown start code from any rules
        var startCodes = !index[0].length && starts;
        this.startCodes = startCodes || [];
        startCodes && this.setCodeIdx(index);
        this.index = index;
    };
    OrRule.prototype.match = function (context) {
        var index = this.index || (this.init(), this.index), rules = index[context.nextCode()] || index[0], len = rules.length, ctx = context.create();
        var err, upErr, i = 0;
        for (; i < len; i++) {
            err = rules[i].match(ctx) || this.consume(ctx);
            if (!err)
                return;
            if (!err.capturable) {
                upErr = err;
                break;
            }
            if (!upErr || err.pos >= upErr.pos)
                upErr = err;
            ctx.reset();
        }
        return this.error(this.EXPECT, ctx, upErr);
    };
    OrRule.prototype.repeatMatch = function (context) {
        var index = this.index || (this.init(), this.index), _a = this.repeat, min = _a[0], max = _a[1], ctx = context.create();
        var rules, len, err, upErr, repeat = 0, i, mlen, dlen;
        out: for (; repeat < max; repeat++) {
            rules = index[ctx.nextCode()] || index[0];
            if ((len = rules.length)) {
                dlen = ctx.dataLen();
                mlen = ctx.len();
                upErr = null;
                for (i = 0; i < len; i++) {
                    err = rules[i].match(ctx);
                    if (!err)
                        continue out;
                    if (!err.capturable) {
                        upErr = err;
                        break;
                    }
                    if (!upErr || err.pos >= upErr.pos)
                        upErr = err;
                    ctx.reset(mlen, dlen);
                }
            }
            if (repeat < min)
                return this.error(this.EXPECT, ctx, upErr);
        }
        return this.consume(ctx);
    };
    OrRule = __decorate([
        mixin_1.mixin({ type: 'Or', split: ' | ' })
    ], OrRule);
    return OrRule;
}(ComplexRule_1.ComplexRule));
exports.OrRule = OrRule;
//# sourceMappingURL=OrRule.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var util_1 = require("./util");
var assert_1 = require("../assert");
var is_1 = require("../is");
var mixin_1 = require("../mixin");
var MatchError = /** @class */ (function () {
    function MatchError(msg, capturable, source, context, rule) {
        !is_1.isBool(capturable) && (capturable = rule.capturable);
        this.capturable = capturable && source ? source.capturable : capturable;
        this.msg = msg;
        this.source = source;
        this.context = context;
        this.rule = rule;
        this.pos = context.startPos();
    }
    MatchError.prototype.position = function () {
        return this.context.source.position(this.pos);
    };
    MatchError = __decorate([
        mixin_1.mixin({ $ruleErr: true })
    ], MatchError);
    return MatchError;
}());
exports.MatchError = MatchError;
function defaultErr(err) {
    return err;
}
function defaultMatch(data, len, context) {
    context.add(data);
}
var idGen = 0;
/**
 * Abstract Rule
 */
var Rule = /** @class */ (function () {
    /**
     * @param name			rule name
     * @param capturable	error is capturable
     * @param onMatch		callback on matched, allow modify the match result or return an error
     * @param onErr			callback on Error, allow to ignore error or modify error message or return new error
     */
    function Rule(name, capturable, onMatch, onErr) {
        this.id = idGen++;
        this.name = name;
        this.capturable = capturable !== false;
        this.onMatch = onMatch || defaultMatch;
        this.onErr = onErr || defaultErr;
    }
    /**
     * create Error
     * @param msg 			error message
     * @param context 		match context
     * @param capturable 	is capturable error
     * @param src 			source error
     */
    Rule.prototype.mkErr = function (msg, context, source, capturable) {
        return new MatchError(msg, capturable, source, context, this);
    };
    /**
     * match fail
     * @param msg 			error message
     * @param context 		match context
     * @param capturable 	is capturable error
     * @param src 			source error
     * @return Error|void: may ignore Error in the error callback
     */
    Rule.prototype.error = function (msg, context, src, capturable) {
        var err = this.mkErr(msg, context, src, capturable);
        var userErr = this.onErr(err, context, this);
        if (userErr)
            return userErr.$ruleErr ? userErr : ((err[0] = String(userErr)), err);
    };
    /**
     * match success
     * > attach the matched result by match callback
     * @param data 		matched data
     * @param len  		matched data length
     * @param context 	match context
     * @return Error|void: may return Error in the match callback
     */
    Rule.prototype.matched = function (data, len, context) {
        var err = this.onMatch(data, len, context, this);
        if (err)
            return err.$ruleErr ? err : this.mkErr(String(err), context, null, false);
    };
    /**
     * match
     * @param context match context
     */
    Rule.prototype.match = function (context) {
        return assert_1.assert();
    };
    /**
     * get start char codes
     */
    Rule.prototype.getStart = function (stack) {
        return this.startCodes;
    };
    /**
     * prepare test before match
     */
    Rule.prototype.test = function (context) {
        return true;
    };
    Rule.prototype.startCodeTest = function (context) {
        return this.startCodeIdx[context.nextCode()];
    };
    Rule.prototype.setStartCodes = function (start, ignoreCase) {
        var codes = [], index = [];
        util_1.eachCharCodes(start, ignoreCase, function (code) {
            if (!index[code]) {
                codes.push(code);
                index[code] = code;
            }
        });
        this.startCodes = codes;
        this.setCodeIdx(index);
    };
    Rule.prototype.setCodeIdx = function (index) {
        if (index.length > 1) {
            this.startCodeIdx = index;
            this.test = this.startCodeTest;
        }
    };
    //──── for debug ─────────────────────────────────────────────────────────────────────────
    /**
     * make rule expression
     * @param expr expression text
     */
    Rule.prototype.mkExpr = function (expr) {
        return "<" + this.type + ": " + expr + ">";
    };
    /**
     * set rule expression
     * 		1. make rule expression
     * 		2. make Expect text
     */
    Rule.prototype.setExpr = function (expr) {
        this.expr = this.mkExpr(expr);
        this.EXPECT = "Expect: " + expr;
    };
    Rule.prototype.getExpr = function (stack) {
        return this.name || this.expr;
    };
    /**
     * toString by name or expression
     */
    Rule.prototype.toString = function () {
        return this.getExpr();
    };
    Rule = __decorate([
        mixin_1.mixin({ $rule: true })
    ], Rule);
    return Rule;
}());
exports.Rule = Rule;
//# sourceMappingURL=Rule.js.map
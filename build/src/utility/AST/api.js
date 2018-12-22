/**
 * AST Parser API
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:58:52 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:27:42 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var is_1 = require("../is");
var collection_1 = require("../collection");
var CharMatchRule_1 = require("./CharMatchRule");
var StringMatchRule_1 = require("./StringMatchRule");
var RegMatchRule_1 = require("./RegMatchRule");
var AndRule_1 = require("./AndRule");
var OrRule_1 = require("./OrRule");
var assert_1 = require("../assert");
var consts_1 = require("../consts");
//========================================================================================
/*                                                                                      *
 *                                      match tools                                     *
 *                                                                                      */
//========================================================================================
exports.discardMatch = consts_1.EMPTY_FN;
function appendMatch(data, len, context) {
    context.addAll(data);
}
exports.appendMatch = appendMatch;
function attachMatch(val) {
    var fn = is_1.isFn(val) ? val : function () { return val; };
    return function (data, len, context) {
        context.add(fn(data, len, context));
    };
}
exports.attachMatch = attachMatch;
function match() {
    return mkMatch(arguments);
}
exports.match = match;
function mkMatch(args, defaultOnMatch) {
    var name, pattern, regexp, pick = 0, startCodes, ignoreCase = false, capturable, onMatch, onErr;
    if (is_1.isObj(args[0])) {
        var desc = args[0], p = desc.pattern;
        if (is_1.isReg(p)) {
            regexp = p;
            pick = desc.pick;
            startCodes = desc.startCodes;
        }
        else if (isMatchPattern(p)) {
            pattern = p;
            ignoreCase = desc.ignoreCase;
        }
        name = desc.name;
        capturable = desc.capturable;
        onMatch = desc.onMatch;
        onErr = desc.onErr;
    }
    else {
        var i = 2;
        if (isMatchPattern(args[1])) {
            name = args[0];
            is_1.isReg(args[1]) ? (regexp = args[1]) : (pattern = args[1]);
        }
        else if (isMatchPattern(args[0])) {
            i = 1;
            is_1.isReg(args[0]) ? (regexp = args[0]) : (pattern = args[0]);
        }
        if (regexp) {
            if (is_1.isBool(args[i]) || is_1.isInt(args[i]))
                pick = args[i++];
            if (isStrOrCodes(args[i]))
                startCodes = args[i++];
        }
        else {
            if (is_1.isBool(args[i]))
                ignoreCase = args[i++];
        }
        if (is_1.isBool(args[i]))
            capturable = args[i++];
        onMatch = args[i++];
        onErr = args[i++];
    }
    onMatch = onMatch || defaultOnMatch;
    return regexp
        ? regMatch(name, regexp, onMatch === exports.discardMatch ? false : pick, startCodes, capturable, onMatch, onErr)
        : pattern
            ? strMatch(name, pattern, ignoreCase, capturable, onMatch, onErr)
            : null;
}
function isStrOrCodes(pattern) {
    return is_1.isStr(pattern) || is_1.isNum(pattern) || is_1.isArray(pattern);
}
function isMatchPattern(pattern) {
    return is_1.isReg(pattern) || isStrOrCodes(pattern);
}
function strMatch(name, pattern, ignoreCase, capturable, onMatch, onErr) {
    var C = is_1.isStr(pattern) && pattern.length > 1 ? StringMatchRule_1.StringMatchRule : CharMatchRule_1.CharMatchRule;
    return new C(name, pattern, ignoreCase, capturable, onMatch, onErr);
}
var REG_ESPEC_CHARS = collection_1.makeMap('dDsStrnt0cbBfvwW', 1, '');
function regMatch(name, pattern, pick, startCodes, capturable, onMatch, onErr) {
    var source = pattern.source;
    if (!pick) {
        var c = 0;
        if (source.length == 1 && source !== '^' && source !== '$') {
            c = source === '.' ? '' : source;
        }
        else if (source.length == 2 && source[0] === '\\' && REG_ESPEC_CHARS[source[1]]) {
            c = source[1];
        }
        if (c != 0)
            return strMatch(name, c, pattern.ignoreCase, capturable, onMatch, onErr);
    }
    return new RegMatchRule_1.RegMatchRule(name, pattern, pick, startCodes, capturable, onMatch, onErr);
}
function and() {
    return mkComplexRule(arguments, AndRule_1.AndRule, [1, 1]);
}
exports.and = and;
function any() {
    return mkComplexRule(arguments, AndRule_1.AndRule, [0, -1]);
}
exports.any = any;
function many() {
    return mkComplexRule(arguments, AndRule_1.AndRule, [1, -1]);
}
exports.many = many;
function option() {
    return mkComplexRule(arguments, AndRule_1.AndRule, [0, 1]);
}
exports.option = option;
function or() {
    return mkComplexRule(arguments, OrRule_1.OrRule, [1, 1]);
}
exports.or = or;
function anyOne() {
    return mkComplexRule(arguments, OrRule_1.OrRule, [0, -1]);
}
exports.anyOne = anyOne;
function manyOne() {
    return mkComplexRule(arguments, OrRule_1.OrRule, [1, -1]);
}
exports.manyOne = manyOne;
function optionOne() {
    return mkComplexRule(arguments, OrRule_1.OrRule, [0, 1]);
}
exports.optionOne = optionOne;
function mkComplexRule(args, Rule, defaultRepeat) {
    var name, builder, rules, repeat, capturable, onMatch, onErr;
    if (is_1.isObj(args[0])) {
        var desc = args[0], r = desc.rules;
        if (is_1.isArray(r) || is_1.isFn(r))
            rules = r;
        repeat = desc.repeat;
        name = desc.name;
        capturable = desc.capturable;
        onMatch = desc.onMatch;
        onErr = desc.onErr;
    }
    else {
        var i = 0;
        if (is_1.isStr(args[i]))
            name = args[i++];
        if (is_1.isArray(args[i]) || is_1.isFn(args[i]))
            rules = args[i++];
        if (is_1.isArray(args[i]))
            repeat = args[i++];
        if (is_1.isBool(args[i]))
            capturable = args[i++];
        onMatch = args[i++];
        onErr = args[i++];
    }
    if (!repeat)
        repeat = defaultRepeat;
    if (rules) {
        builder = rulesBuilder(rules);
        return new Rule(name, repeat, builder, capturable, onMatch, onErr);
    }
}
function rulesBuilder(rules) {
    return function (_rule) {
        return collection_1.mapArray(is_1.isFn(rules) ? rules(_rule) : rules, function (r, i) {
            if (!r)
                return collection_1.SKIP;
            var rule = r.$rule ? r : is_1.isArray(r) ? mkMatch(r) : mkMatch([r], exports.discardMatch);
            assert_1.assert.is(rule, '{}: Invalid Rule Configuration on index {d}: {:.80="..."j}', _rule, i, r);
            return rule;
        });
    };
}
//# sourceMappingURL=api.js.map
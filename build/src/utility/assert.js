/**
 * @module utility/assert
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 13:45:36 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var is_1 = require("../utility/is");
var create_1 = require("./create");
var string_1 = require("../utility/string");
var fn_1 = require("../utility/fn");
var collection_1 = require("../utility/collection");
var format_1 = require("./format");
var deepEq_1 = require("./deepEq");
var formatters = [], formatArgHandlers = [];
function parseMessage(msg, args, msgIdx) {
    var fs = formatters[msgIdx] ||
        ((formatArgHandlers[msgIdx] = function (args, offset) {
            return args[0][offset >= msgIdx ? offset + 1 : offset];
        }),
            (formatters[msgIdx] = create_1.create(null)));
    return (fs[msg] || (fs[msg] = format_1.formatter(msg, msgIdx, formatArgHandlers[msgIdx])))(args);
}
exports.assert = function assert(msg) {
    throw new Error(parseMessage(msg || 'Error', arguments, 0));
};
function catchErr(fn) {
    try {
        fn();
    }
    catch (e) {
        return e;
    }
}
function checkErr(expect, err) {
    var msg = is_1.isStr(expect) ? expect : expect.message;
    return msg === err.message;
}
var ERROR = new Error();
var throwMsg = mkMsg(objFormatter(1), 'throw');
exports.assert["throw"] = function (fn, expect, msg) {
    var err = catchErr(fn);
    if (!err || (expect && !checkErr(expect, err))) {
        arguments[0] = err;
        !expect && (arguments[2] = ERROR);
        throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
    }
    return exports.assert;
};
exports.assert.notThrow = function (fn, expect, msg) {
    var err = catchErr(fn);
    if (err && (!expect || !checkErr(expect, err))) {
        arguments[0] = err;
        !expect && (arguments[2] = ERROR);
        throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
    }
    return exports.assert;
};
function extendAssert(name, condition, args, dmsg, Err) {
    var params = is_1.isStr(args)
        ? args.split(/,/g)
        : is_1.isNum(args)
            ? collection_1.makeArray(args, function (i) { return "arg" + (i + 1); })
            : args, paramStr = params.join(', '), cond = is_1.isArray(condition) ? condition[0] : condition, expr = (is_1.isArray(condition) ? condition[1] : '') + (is_1.isStr(cond) ? "(" + cond + ")" : "cond(" + paramStr + ")");
    return (exports.assert[name] = fn_1.createFn("return function assert" + string_1.upperFirst(name) + "(" + paramStr + ", msg){\n\tif (" + expr + ")\n\t\tthrow new Err(parseMsg(msg || dmsg, arguments, " + params.length + "));\n\treturn assert;\n}", ['Err', 'parseMsg', 'dmsg', 'cond', 'assert'])(Err || Error, parseMessage, dmsg, cond, exports.assert));
}
// [condition, argcount?, [msg, not msg], Error]
function extendAsserts(apis) {
    collection_1.eachObj(apis, function (desc, name) {
        var condition = desc[0], args = desc[1], msg = desc[2], Err = desc[3] || TypeError;
        msg[0] && extendAssert(name, [condition, '!'], args, msg[0], Err);
        msg[1] && extendAssert('not' + string_1.upperFirst(name), condition, args, msg[1], Err);
    });
}
var NULL = 'null';
var UNDEFINED = 'undefined';
var BOOLEAN = 'boolean';
var NUMBER = 'number';
var INTEGER = 'integer';
var STRING = 'string';
var FUNCTION = 'function';
var ARRAY = 'Array';
var TYPED_ARRAY = 'TypedArray';
extendAssert('is', '!o', 'o', expectMsg('Exist'));
extendAssert('not', 'o', 'o', expectMsg('Not Exist'));
extendAsserts({
    eq: [is_1.eq, 2, mkMsg(objFormatter(1))],
    eql: [deepEq_1.deepEq, 2, mkMsg(objFormatter(1))],
    nul: [is_1.isNull, 1, mkMsg(NULL)],
    nil: [is_1.isNil, 1, mkMsg(typeExpect(NULL, UNDEFINED))],
    undef: [is_1.isUndef, 1, mkMsg(UNDEFINED)],
    bool: [is_1.isBool, 1, mkMsg(BOOLEAN)],
    num: [is_1.isNum, 1, mkMsg(NUMBER)],
    int: [is_1.isInt, 1, mkMsg(INTEGER)],
    str: [is_1.isStr, 1, mkMsg(STRING)],
    fn: [is_1.isFn, 1, mkMsg(FUNCTION)],
    primitive: [
        is_1.isPrimitive,
        1,
        mkMsg("Primitive type(" + typeExpect(NULL, UNDEFINED, BOOLEAN, NUMBER, INTEGER, STRING, FUNCTION) + ")")
    ],
    boolean: [is_1.isBoolean, 1, mkMsg(packTypeExpect(BOOLEAN))],
    number: [is_1.isNumber, 1, mkMsg(packTypeExpect(NUMBER))],
    string: [is_1.isString, 1, mkMsg(packTypeExpect(STRING))],
    date: [is_1.isDate, 1, mkMsg('Date')],
    reg: [is_1.isReg, 1, mkMsg('RegExp')],
    array: [is_1.isArray, 1, mkMsg(ARRAY)],
    typedArray: [is_1.isTypedArray, 1, mkMsg('TypedArray')],
    arrayLike: [
        is_1.isArrayLike,
        1,
        mkMsg(typeExpect(ARRAY, packTypeExpect(STRING), 'Arguments', TYPED_ARRAY, 'NodeList', 'HTMLCollection'))
    ],
    obj: [is_1.isObj, 1, mkMsg('Object')],
    nan: [isNaN, 1, mkMsg('NaN')],
    finite: [isFinite, 1, mkMsg('Finite')],
    blank: [is_1.isBlank, 1, mkMsg('Blank')],
    less: ['o<t', 'o,t', mkMsg(objFormatter(1), 'less than')],
    greater: ['o>t', 'o,t', mkMsg(objFormatter(1), 'greater than')],
    match: ['reg.test(str)', 'str,reg', mkMsg(objFormatter(1), 'match')],
    range: ['o>=s&&o<e', 'o,s,e', mkMsg("[{1} - {2})")]
});
function mkMsg(expect, to) {
    return [expectMsg(expect, false, to), expectMsg(expect, true, to)];
}
function expectMsg(expect, not, to) {
    return "Expected " + objFormatter(0) + " " + (not ? 'not ' : '') + (to || 'to') + " " + expect;
}
function objFormatter(idx) {
    return "{" + idx + ":.80=\"...\"j}";
}
function packTypeExpect(base, all) {
    return all ? typeExpect(base, string_1.upperFirst(base)) : string_1.upperFirst(base);
}
function typeExpect() {
    return Array.prototype.join.call(arguments, ' | ');
}
//# sourceMappingURL=assert.js.map
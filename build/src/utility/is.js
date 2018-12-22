/**
 * type checker
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 11:11:05 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var consts_1 = require("./consts");
var constructor_1 = require("./constructor");
/**
 * is equals
 * > o1 === o2 || NaN === NaN
 */
function eq(o1, o2) {
    return o1 === o2 || (o1 !== o1 && o2 !== o2);
}
exports.eq = eq;
//========================================================================================
/*                                                                                      *
 *                                    primitive type                                    *
 *                                                                                      */
//========================================================================================
/**
 * is null
 */
function isNull(o) {
    return o === null;
}
exports.isNull = isNull;
/**
 * is undefined
 */
function isUndef(o) {
    return o === undefined;
}
exports.isUndef = isUndef;
/**
 * is null or undefined
 */
function isNil(o) {
    return o === null || o === undefined;
}
exports.isNil = isNil;
/**
 * is boolean
 */
exports.isBool = mkIsPrimitive(consts_1.TYPE_BOOL);
/**
 * is a number
 */
exports.isNum = mkIsPrimitive(consts_1.TYPE_NUM);
/**
 * is a string
 */
exports.isStr = mkIsPrimitive(consts_1.TYPE_STRING);
/**
 * is a function
 */
exports.isFn = mkIsPrimitive(consts_1.TYPE_FN);
/**
 * is integer number
 */
function isInt(o) {
    return o === 0 || (o ? typeof o === consts_1.TYPE_NUM && o % 1 === 0 : false);
}
exports.isInt = isInt;
/**
 * is primitive type
 * - null
 * - undefined
 * - boolean
 * - number
 * - string
 * - function
 */
function isPrimitive(o) {
    if (o === undefined || o === null) {
        return true;
    }
    switch (typeof o) {
        case consts_1.TYPE_BOOL:
        case consts_1.TYPE_NUM:
        case consts_1.TYPE_STRING:
        case consts_1.TYPE_FN:
            return true;
    }
    return false;
}
exports.isPrimitive = isPrimitive;
function mkIsPrimitive(type) {
    return function is(o) {
        return typeof o === type;
    };
}
//========================================================================================
/*                                                                                      *
 *                                    reference type                                    *
 *                                                                                      */
//========================================================================================
/**
 * is instanceof
 */
function instOf(obj, Cls) {
    return obj !== undefined && obj !== null && obj instanceof Cls;
}
exports.instOf = instOf;
/**
 * is child instance of Type
 */
function is(o, Type) {
    if (o !== undefined && o !== null) {
        var C = o[consts_1.CONSTRUCTOR] || Object;
        if (Type[consts_1.CONSTRUCTOR] === Array) {
            var i = Type.length;
            while (i--) {
                if (C === Type[i]) {
                    return true;
                }
            }
        }
        else {
            return C === Type;
        }
    }
    return false;
}
exports.is = is;
/**
 * is boolean or Boolean
 */
exports.isBoolean = mkIs(Boolean);
/**
 * is number or Number
 */
exports.isNumber = mkIs(Number);
/**
 * is string or String
 */
exports.isString = mkIs(String);
/**
 * is Date
 */
exports.isDate = mkIs(Date);
/**
 * is RegExp
 */
exports.isReg = mkIs(RegExp);
/**
 * is Array
 */
exports.isArray = Array.isArray || mkIs(Array);
/**
 * is Typed Array
 */
exports.isTypedArray = exports.isFn(ArrayBuffer) ? ArrayBuffer.isView : function () { return false; };
/**
 * is Array or pseudo-array
 * - Array
 * - String
 * - IArguments
 * - NodeList
 * - HTMLCollection
 * - Typed Array
 * - {length: int, [length-1]: any}
 */
function isArrayLike(o) {
    if (o) {
        switch (o[consts_1.CONSTRUCTOR]) {
            case Array:
            case String:
            case consts_1.GLOBAL.NodeList:
            case consts_1.GLOBAL.HTMLCollection:
            case consts_1.GLOBAL.Int8Array:
            case consts_1.GLOBAL.Uint8Array:
            case consts_1.GLOBAL.Int16Array:
            case consts_1.GLOBAL.Uint16Array:
            case consts_1.GLOBAL.Int32Array:
            case consts_1.GLOBAL.Uint32Array:
            case consts_1.GLOBAL.Float32Array:
            case consts_1.GLOBAL.Float64Array:
                return true;
        }
        var len = o.length;
        return typeof len === consts_1.TYPE_NUM && (len === 0 || (len > 0 && len % 1 === 0 && len - 1 in o));
    }
    return o === '';
}
exports.isArrayLike = isArrayLike;
/**
 * is simple Object
 * TODO object may has constructor property
 */
function isObj(o) {
    return o !== undefined && o !== null && constructor_1.getConstructor(o) === Object;
}
exports.isObj = isObj;
function mkIs(Type) {
    return function is(o) {
        return o !== undefined && o !== null && o[consts_1.CONSTRUCTOR] === Type;
    };
}
var blankStrReg = /^\s*$/;
/**
 * is empty
 * - string: trim(string).length === 0
 * - array: array.length === 0
 * - pseudo-array: pseudo-array.length === 0
 */
function isBlank(o) {
    if (o) {
        if (o[consts_1.CONSTRUCTOR] === String) {
            return blankStrReg.test(o);
        }
        return o.length === 0;
    }
    return true;
}
exports.isBlank = isBlank;
//# sourceMappingURL=is.js.map
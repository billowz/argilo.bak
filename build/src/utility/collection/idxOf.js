/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 13:38:16 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var each_1 = require("./each");
var fn_1 = require("../fn");
var is_1 = require("../is");
function parseCallback(value, scope) {
    if (is_1.isFn(value))
        return fn_1.bind(value, scope);
    return function defaultHandler(data, idx, obj) {
        return is_1.eq(data, value);
    };
}
function doIdxOfObj(each, obj, value, scope, own) {
    if (is_1.isBool(scope)) {
        own = scope;
        scope = null;
    }
    var callback = parseCallback(value, scope);
    var idx = -1;
    each(obj, function (data, prop, obj) {
        var r = callback(data, prop, obj);
        if (r === true) {
            idx = prop;
            return each_1.STOP;
        }
        else if (r === each_1.STOP)
            return r;
    }, null, own);
    return idx;
}
exports.doIdxOfObj = doIdxOfObj;
function idxOfObj(obj, value, scope, own) {
    return doIdxOfObj(each_1.eachObj, obj, value, scope, own);
}
exports.idxOfObj = idxOfObj;
function doIdxOfArray(each, array, value, scope) {
    var callback = parseCallback(value, scope);
    var idx = -1;
    each(array, function (data, index, array) {
        var r = callback(data, index, array);
        if (r === true) {
            idx = index;
            return each_1.STOP;
        }
        else if (r === each_1.STOP)
            return r;
    });
    return idx;
}
exports.doIdxOfArray = doIdxOfArray;
function idxOfArray(array, value, scope) {
    return doIdxOfArray(each_1.eachArray, array, value, scope);
}
exports.idxOfArray = idxOfArray;
function ridxOfArray(array, value, scope) {
    return doIdxOfArray(each_1.reachArray, array, value, scope);
}
exports.ridxOfArray = ridxOfArray;
function doIdxOf(eacharray, eachobj, obj, value, scope, own) {
    if (is_1.isArrayLike(obj))
        return doIdxOfArray(eacharray, obj, value, scope);
    return doIdxOfObj(eachobj, obj, value, scope, own);
}
exports.doIdxOf = doIdxOf;
function idxOf(obj, value, scope, own) {
    return doIdxOf(each_1.eachArray, each_1.eachObj, obj, value, scope, own);
}
exports.idxOf = idxOf;
//# sourceMappingURL=idxOf.js.map
exports.__esModule = true;
var each_1 = require("./each");
var fn_1 = require("../fn");
var is_1 = require("../is");
function doReduceObj(each, obj, accumulator, callback, scope, own) {
    if (is_1.isBool(scope)) {
        own = scope;
    }
    else {
        callback = fn_1.bind(callback, scope);
    }
    each(obj, function (value, prop, obj) {
        var rs = callback(accumulator, value, prop, obj);
        if (rs === each_1.STOP)
            return each_1.STOP;
        accumulator = rs;
    }, null, own);
    return accumulator;
}
exports.doReduceObj = doReduceObj;
function reduceObj(obj, accumulator, callback, scope, own) {
    return doReduceObj(each_1.eachObj, obj, accumulator, callback, scope, own);
}
exports.reduceObj = reduceObj;
function doReduceArray(each, array, accumulator, callback, scope) {
    callback = fn_1.bind(callback, scope);
    each(array, function (data, index, array) {
        var rs = callback(accumulator, data, index, array);
        if (rs === each_1.STOP)
            return each_1.STOP;
        accumulator = rs;
    });
    return accumulator;
}
exports.doReduceArray = doReduceArray;
/**
 * reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
function reduceArray(array, accumulator, callback, scope) {
    return doReduceArray(each_1.eachArray, array, accumulator, callback, scope);
}
exports.reduceArray = reduceArray;
/**
 * revice reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
function rreduceArray(array, accumulator, callback, scope) {
    return doReduceArray(each_1.reachArray, array, accumulator, callback, scope);
}
exports.rreduceArray = rreduceArray;
function doReduce(eacharray, eachobj, obj, accumulator, callback, scope, own) {
    if (is_1.isArrayLike(obj))
        return doReduceArray(eacharray, obj, accumulator, callback, scope);
    return doReduceObj(eachobj, obj, accumulator, callback, scope, own);
}
exports.doReduce = doReduce;
function reduce(obj, accumulator, callback, scope, own) {
    return doReduce(each_1.eachArray, each_1.eachObj, obj, accumulator, callback, scope, own);
}
exports.reduce = reduce;
//# sourceMappingURL=reduce.js.map
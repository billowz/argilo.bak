/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 13:54:35 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var control_1 = require("./control");
var each_1 = require("./each");
var create_1 = require("../create");
var fn_1 = require("../fn");
var is_1 = require("../is");
/**
 * SKIP Control
 * > skip map
 */
exports.SKIP = new control_1.Control('SKIP');
function doMapObj(each, obj, callback, scope, own) {
    if (is_1.isBool(scope)) {
        own = scope;
    }
    else {
        callback = fn_1.bind(callback, scope);
    }
    var copy = create_1.create(null);
    each(obj, function (value, prop, obj) {
        var v = callback(value, prop, obj);
        if (v === each_1.STOP)
            return each_1.STOP;
        if (v !== exports.SKIP)
            copy[prop] = v;
    }, null, own);
    return copy;
}
exports.doMapObj = doMapObj;
function mapObj(obj, callback, scope, own) {
    return doMapObj(each_1.eachObj, obj, callback, scope, own);
}
exports.mapObj = mapObj;
function doMapArray(each, array, callback, scope) {
    callback = fn_1.bind(callback, scope);
    var copy = [];
    var j = 0;
    each(array, function (data, index, array) {
        var v = callback(data, index, array);
        if (v === each_1.STOP)
            return each_1.STOP;
        if (v !== exports.SKIP)
            copy[j++] = v;
    });
    return copy;
}
exports.doMapArray = doMapArray;
/**
 * array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		callback
 * @param scope		scope of callback
 * @return array index or -1
 */
function mapArray(array, callback, scope) {
    return doMapArray(each_1.eachArray, array, callback, scope);
}
exports.mapArray = mapArray;
/**
 * revice array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		map value of callback
 * @param scope		scope of callback
 * @return array index or -1
 */
function rmapArray(array, callback, scope) {
    return doMapArray(each_1.reachArray, array, callback, scope);
}
exports.rmapArray = rmapArray;
function doMap(eacharray, eachobj, obj, callback, scope, own) {
    if (is_1.isArrayLike(obj))
        return doMapArray(eacharray, obj, callback, scope);
    return doMapObj(eachobj, obj, callback, scope, own);
}
exports.doMap = doMap;
function map(obj, callback, scope, own) {
    return doMap(each_1.eachArray, each_1.eachObj, obj, callback, scope, own);
}
exports.map = map;
//# sourceMappingURL=map.js.map
exports.__esModule = true;
/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 13:39:11 GMT+0800 (China Standard Time)
 */
var control_1 = require("./control");
var fn_1 = require("../fn");
var prop_1 = require("../prop");
var is_1 = require("../is");
/**
 * STOP Control
 * > stop each/map/indexOf...
 */
exports.STOP = new control_1.Control('STOP');
function eachProps(obj, callback, scope, own) {
    if (is_1.isBool(scope)) {
        own = scope;
    }
    else {
        callback = fn_1.bind(callback, scope);
    }
    var k;
    if (own === false) {
        for (k in obj)
            if (callback(k, obj) === exports.STOP)
                return k;
    }
    else {
        for (k in obj)
            if (prop_1.hasOwnProp(obj, k) && callback(k, obj) === exports.STOP)
                return k;
    }
    return false;
}
exports.eachProps = eachProps;
function eachObj(obj, callback, scope, own) {
    var args = arguments;
    if (is_1.isBool(scope)) {
        own = scope;
    }
    else {
        callback = fn_1.bind(callback, scope);
    }
    var k;
    if (own === false) {
        for (k in obj)
            if (callback(obj[k], k, obj) === exports.STOP)
                return k;
    }
    else {
        for (k in obj)
            if (prop_1.hasOwnProp(obj, k) && callback(obj[k], k, obj) === exports.STOP)
                return k;
    }
    return false;
}
exports.eachObj = eachObj;
/**
 * each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
function eachArray(array, callback, scope) {
    callback = fn_1.bind(callback, scope);
    for (var i = 0, l = array.length; i < l; i++) {
        if (callback(array[i], i, array) === exports.STOP)
            return i;
    }
    return false;
}
exports.eachArray = eachArray;
/**
 * reverse each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
function reachArray(array, callback, scope) {
    callback = fn_1.bind(callback, scope);
    var i = array.length;
    while (i--)
        if (callback(array[i], i, array) === exports.STOP)
            return i;
    return false;
}
exports.reachArray = reachArray;
function doEach(_eachArray, _eachObj, obj, callback, scope, own) {
    if (is_1.isArrayLike(obj))
        return _eachArray(obj, callback, scope);
    return _eachObj(obj, callback, scope, own);
}
exports.doEach = doEach;
function each(obj, callback, scope, own) {
    return doEach(eachArray, eachObj, obj, callback, scope, own);
}
exports.each = each;
//# sourceMappingURL=each.js.map
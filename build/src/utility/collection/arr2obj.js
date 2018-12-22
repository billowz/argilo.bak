/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
 * @modified Fri Nov 30 2018 17:42:28 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var each_1 = require("./each");
var fn_1 = require("../fn");
var is_1 = require("../is");
var create_1 = require("../create");
function doArr2Obj(each, array, callback, scope) {
    var obj = create_1.create(null);
    callback = fn_1.bind(callback, scope);
    each(array, function (data, index, array) {
        var r = callback(data, index, array);
        if (is_1.isArray(r)) {
            obj[r[0]] = r[1];
        }
        else {
            return r;
        }
    });
    return obj;
}
exports.doArr2Obj = doArr2Obj;
/**
 * convert array to object
 */
function arr2obj(array, callback, scope) {
    return doArr2Obj(each_1.eachArray, array, callback, scope);
}
exports.arr2obj = arr2obj;
function makeMap(array, val, split) {
    if (is_1.isStr(array))
        array = array.split(is_1.isStr(split) ? split : ',');
    return arr2obj(array, is_1.isFn(val) ? val : function (data) { return [data, val]; });
}
exports.makeMap = makeMap;
//# sourceMappingURL=arr2obj.js.map
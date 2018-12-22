/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Nov 15 2018 12:13:54 GMT+0800 (China Standard Time)
 * @modified Tue Dec 04 2018 20:10:32 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var each_1 = require("./each");
exports.STOP = each_1.STOP;
exports.eachProps = each_1.eachProps;
exports.eachArray = each_1.eachArray;
exports.eachObj = each_1.eachObj;
exports.each = each_1.each;
var map_1 = require("./map");
exports.SKIP = map_1.SKIP;
exports.mapArray = map_1.mapArray;
exports.mapObj = map_1.mapObj;
exports.map = map_1.map;
var idxOf_1 = require("./idxOf");
exports.idxOfArray = idxOf_1.idxOfArray;
exports.idxOfObj = idxOf_1.idxOfObj;
exports.idxOf = idxOf_1.idxOf;
var reduce_1 = require("./reduce");
exports.reduceArray = reduce_1.reduceArray;
exports.reduceObj = reduce_1.reduceObj;
exports.reduce = reduce_1.reduce;
var obj2arr_1 = require("./obj2arr");
exports.keys = obj2arr_1.keys;
exports.values = obj2arr_1.values;
var arr2obj_1 = require("./arr2obj");
exports.arr2obj = arr2obj_1.arr2obj;
exports.makeMap = arr2obj_1.makeMap;
function makeArray(len, callback) {
    var array = new Array(len);
    var i = len;
    while (i--)
        array[i] = callback(i);
    return array;
}
exports.makeArray = makeArray;
//# sourceMappingURL=index.js.map
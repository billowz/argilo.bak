exports.__esModule = true;
var each_1 = require("./each");
var map_1 = require("./map");
var is_1 = require("../is");
var fn_1 = require("../fn");
function defaultObjKeyHandler(prop, obj) {
    return prop;
}
function doObjKeys(each, obj) {
    var rs = [], args = arguments;
    var handler = defaultObjKeyHandler, i = 2, j = 0;
    if (is_1.isFn(args[i])) {
        handler = args[i++];
        if (!is_1.isBool(args[i]))
            handler = fn_1.bind(handler, args[i++]);
    }
    each(obj, function (prop, obj) {
        var val = handler(prop, obj);
        if (val === each_1.STOP)
            return each_1.STOP;
        if (val !== map_1.SKIP)
            rs[j++] = val;
    }, null, args[i]);
    return rs;
}
exports.doObjKeys = doObjKeys;
function keys(obj, callback, scope, own) {
    return doObjKeys(each_1.eachProps, obj, callback, scope, own);
}
exports.keys = keys;
function defaultObjValueHandler(value, prop, obj) {
    return value;
}
function doObjValues(each, obj) {
    var rs = [], args = arguments;
    var handler = defaultObjValueHandler, i = 1, j = 0;
    if (is_1.isFn(args[i])) {
        handler = args[i++];
        if (!is_1.isBool(args[i]))
            handler = fn_1.bind(handler, args[i++]);
    }
    each(obj, function (data, prop, obj) {
        var val = handler(data, prop, obj);
        if (val === each_1.STOP)
            return each_1.STOP;
        if (val !== map_1.SKIP)
            rs[j++] = val;
    }, null, args[i]);
    return rs;
}
exports.doObjValues = doObjValues;
function values(obj, callback, scope, own) {
    return doObjValues(each_1.eachObj, obj, callback, scope, own);
}
exports.values = values;
//# sourceMappingURL=obj2arr.js.map
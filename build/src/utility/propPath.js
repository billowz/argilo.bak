/**
 * @module utility/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 13:21:11 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var create_1 = require("./create");
var is_1 = require("./is");
var collection_1 = require("./collection");
var pathCache = create_1.create(null);
// (^ | .) prop | (index | "string prop" | 'string prop')
var pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g;
function parsePath(path, cacheable) {
    if (is_1.isArray(path))
        return path;
    var array = pathCache[path];
    if (!array) {
        array = [];
        var match, idx = 0, cidx, i = 0;
        while ((match = pathReg.exec(path))) {
            cidx = pathReg.lastIndex;
            if (cidx !== idx + match[0].length)
                throw new SyntaxError("Invalid Path: \"" + path + "\", unkown character[" + path.charAt(idx) + "] at offset:" + idx);
            array[i++] = match[1] || match[2] || match[3] || match[4];
            idx = cidx;
        }
        if (cacheable === false)
            return array;
        pathCache[path] = array;
    }
    return array.slice();
}
exports.parsePath = parsePath;
function formatPath(path) {
    return is_1.isArray(path) ? collection_1.mapArray(path, formatPathHandler).join('') : path;
}
exports.formatPath = formatPath;
function formatPathHandler(prop) {
    return "[\"" + String(prop).replace("'", '\\"') + "\"]";
}
function get(obj, path) {
    path = parsePath(path);
    var l = path.length - 1;
    var i = 0;
    for (; i < l; i++)
        if (((obj = obj[path[i]]), obj === null || obj === undefined))
            return;
    if (obj && ~l)
        return obj[path[i]];
}
exports.get = get;
function set(obj, path, value) {
    path = parsePath(path);
    var l = path.length - 1;
    var i = 0;
    for (; i < l; i++)
        obj = obj[path[i]] || (obj[path[i]] = {});
    ~l && (obj[path[i]] = value);
}
exports.set = set;
//# sourceMappingURL=propPath.js.map
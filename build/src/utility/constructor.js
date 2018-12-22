/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 11:11:43 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var consts_1 = require("./consts");
function getConstructor(o) {
    var C = o[consts_1.CONSTRUCTOR];
    return typeof C === consts_1.TYPE_FN ? C : Object;
}
exports.getConstructor = getConstructor;
//# sourceMappingURL=constructor.js.map
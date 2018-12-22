/**
 * @module utility/mixin
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Fri Dec 21 2018 10:24:24 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var prop_1 = require("./prop");
function mixin(behaviour) {
    return function mixin(Class) {
        var proto = Class.prototype;
        for (var k in behaviour)
            if (prop_1.hasOwnProp(behaviour, k))
                proto[k] = behaviour[k];
        return Class;
    };
}
exports.mixin = mixin;
//# sourceMappingURL=mixin.js.map
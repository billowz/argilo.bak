exports.__esModule = true;
/**
 * @module utility/cache
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:03:32 GMT+0800 (China Standard Time)
 */
var create_1 = require("./create");
function cache(key, builder, ca) {
    var cache = create_1.create(null);
    return function () { };
}
exports.cache = cache;
//# sourceMappingURL=cache.js.map
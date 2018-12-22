exports.__esModule = true;
/**
 * Object.assign shim
 * @module utility/assign
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 14:03:59 GMT+0800 (China Standard Time)
 */
var prop_1 = require("./prop");
/**
 *
 * @param target
 * @param overrides
 * @param filter
 * @param startOffset 	start offset in overrides, default: 0
 * @param endOffset 	end offset in overrides, default: overrides.length-1
 */
function doAssign(target, overrides, filter, startOffset, endOffset) {
    if (!target) {
        target = {};
    }
    var l = endOffset || overrides.length - 1;
    var i = startOffset || 0, override, prop;
    for (; i < l; i++) {
        if ((override = overrides[i])) {
            for (prop in override) {
                if (filter(prop, target, override)) {
                    target[prop] = override[prop];
                }
            }
        }
    }
    return target;
}
exports.doAssign = doAssign;
function assign(target) {
    return doAssign(target, arguments, defaultAssignFilter, 1);
}
exports.assign = assign;
function assignIf(target) {
    return doAssign(target, arguments, assignIfFilter, 1);
}
exports.assignIf = assignIf;
/**
 * default assign filter
 * - property is owner in override
 * @see {AssignFilter}
 */
function defaultAssignFilter(prop, target, override) {
    return prop_1.hasOwnProp(override, prop);
}
exports.defaultAssignFilter = defaultAssignFilter;
/**
 * assign if filter
 * - property is owner in override
 * - property not in target object
 * @see {AssignFilter}
 */
function assignIfFilter(prop, target, override) {
    return prop_1.hasOwnProp(override, prop) && !(prop in target);
}
exports.assignIfFilter = assignIfFilter;
//# sourceMappingURL=assign.js.map
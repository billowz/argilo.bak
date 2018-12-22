/**
 * regexp utilities
 * @module utility/reg
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 20:00:44 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var is_1 = require("./is");
/**
 * is support sticky on RegExp
 */
exports.regStickySupport = is_1.isBool(/(?:)/.sticky);
/**
 * is support unicode on RegExp
 */
exports.regUnicodeSupport = is_1.isBool(/(?:)/.unicode);
var REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
/**
 * escape string for RegExp
 */
function reEscape(str) {
    return str.replace(REG_ESCAPE, '\\$&');
}
exports.reEscape = reEscape;
//# sourceMappingURL=reg.js.map
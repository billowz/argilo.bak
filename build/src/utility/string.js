exports.__esModule = true;
var is_1 = require("./is");
//========================================================================================
/*                                                                                      *
 *                                       char code                                      *
 *                                                                                      */
//========================================================================================
/**
 * get char code
 * > string.charCodeAt
 */
function charCode(str, index) {
    return str.charCodeAt(index || 0);
}
exports.charCode = charCode;
/**
 * get char by char code
 * > String.fromCharCode
 */
function char(code) {
    return String.fromCharCode(code);
}
exports.char = char;
//========================================================================================
/*                                                                                      *
 *                                         trim                                         *
 *                                                                                      */
//========================================================================================
var TRIM_REG = /(^\s+)|(\s+$)/g;
/**
 * trim
 */
function trim(str) {
    return str.replace(TRIM_REG, '');
}
exports.trim = trim;
//========================================================================================
/*                                                                                      *
 *                                         case                                         *
 *                                                                                      */
//========================================================================================
var FIRST_LOWER_LETTER_REG = /^[a-z]/;
/**
 * upper first char
 */
function upperFirst(str) {
    return str.replace(FIRST_LOWER_LETTER_REG, upper);
}
exports.upperFirst = upperFirst;
function upper(m) {
    return m.toUpperCase();
}
exports.upper = upper;
function lower(m) {
    return m.toLowerCase();
}
exports.lower = lower;
//========================================================================================
/*                                                                                      *
 *                                  parse string value                                  *
 *                                                                                      */
//========================================================================================
/**
 * convert any value to string
 * - undefined | null: ''
 * - NaN:
 * - Infinity:
 * - other: String(value)
 * TODO support NaN, Infinity
 */
function strval(obj) {
    return is_1.isNil(obj) ? '' : String(obj);
}
exports.strval = strval;
//========================================================================================
/*                                                                                      *
 *                                        escape                                        *
 *                                                                                      */
//========================================================================================
var STR_ESCAPE_MAP = {
    '\n': '\\n',
    '\t': '\\t',
    '\f': '\\f',
    '"': '\\"',
    "'": "\\'"
}, STR_ESCAPE = /[\n\t\f"']/g;
function escapeStr(str) {
    return str.replace(STR_ESCAPE, function (str) { return STR_ESCAPE_MAP[str]; });
}
exports.escapeStr = escapeStr;
//# sourceMappingURL=string.js.map
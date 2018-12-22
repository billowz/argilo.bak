exports.__esModule = true;
/**
 * utilities for ast builder
 *
 * @module utility/AST
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-09 13:22:51
 * @modified 2018-11-09 13:22:51 by Tao Zeng (tao.zeng.zt@qq.com)
 */
var is_1 = require("../is");
/**
 * each char codes
 */
function eachCharCodes(codes, ignoreCase, cb) {
    if (is_1.isStr(codes)) {
        var i = codes.length;
        while (i--)
            eachCharCode(codes.charCodeAt(i), ignoreCase, cb);
    }
    else if (is_1.isArray(codes)) {
        var i = codes.length;
        while (i--)
            eachCharCodes(codes[i], ignoreCase, cb);
    }
    else if (is_1.isInt(codes)) {
        eachCharCode(codes, ignoreCase, cb);
    }
}
exports.eachCharCodes = eachCharCodes;
function eachCharCode(code, ignoreCase, cb) {
    cb(code);
    if (ignoreCase) {
        if (code <= 90) {
            if (code >= 65)
                cb(code + 32);
        }
        else if (code <= 122) {
            cb(code - 32);
        }
    }
}
//# sourceMappingURL=util.js.map
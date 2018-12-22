/**
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @module utility
 * @created 2018-11-09 15:23:35
 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
 */
exports.__esModule = true;
exports.CONSTRUCTOR = 'constructor';
exports.PROTOTYPE = 'prototype';
exports.PROTO = '__proto__';
exports.TYPE_BOOL = 'boolean';
exports.TYPE_FN = 'function';
exports.TYPE_NUM = 'number';
exports.TYPE_STRING = 'string';
exports.TYPE_UNDEF = 'undefined';
exports.GLOBAL = typeof window !== exports.TYPE_UNDEF
    ? window
    : typeof global !== exports.TYPE_UNDEF
        ? global
        : typeof self !== exports.TYPE_UNDEF
            ? self
            : {};
function EMPTY_FN() { }
exports.EMPTY_FN = EMPTY_FN;
//# sourceMappingURL=consts.js.map
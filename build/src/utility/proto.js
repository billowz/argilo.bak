exports.__esModule = true;
/**
 * prototype utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 20:00:18 GMT+0800 (China Standard Time)
 */
var consts_1 = require("./consts");
var __hasOwn = Object[consts_1.PROTOTYPE].hasOwnProperty;
var __getProto = Object.getPrototypeOf, ____setProto = Object.setPrototypeOf;
/**
 * is support Object.getPrototypeOf and Object.setPrototypeOf
 */
exports.prototypeOfSupport = !!____setProto;
exports.protoPropSupport = { __proto__: [] } instanceof Array;
/**
 * Object.getPrototypeOf shim
 */
exports.protoOf = ____setProto
    ? __getProto
    : __getProto
        ? function getPrototypeOf(obj) {
            return obj[consts_1.PROTO] || __getProto(obj);
        }
        : function getPrototypeOf(obj) {
            return (__hasOwn.call(obj, consts_1.PROTO) ? obj[consts_1.PROTO] : obj[consts_1.CONSTRUCTOR][consts_1.PROTOTYPE]) || null;
        };
exports.__setProto = ____setProto ||
    function setPrototypeOf(obj, proto) {
        obj[consts_1.PROTO] = proto;
        return obj;
    };
/**
 * Object.setPrototypeOf shim
 */
exports.setProto = ____setProto ||
    (exports.protoPropSupport
        ? exports.__setProto
        : function setPrototypeOf(obj, proto) {
            for (var p in proto) {
                if (__hasOwn.call(proto, p)) {
                    obj[p] = proto[p];
                }
            }
            return exports.__setProto(obj, proto);
        });
//# sourceMappingURL=proto.js.map
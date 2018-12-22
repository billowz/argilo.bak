exports.__esModule = true;
/**
 * prop utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 12:44:40 GMT+0800 (China Standard Time)
 */
var consts_1 = require("./consts");
var proto_1 = require("./proto");
var __hasOwn = Object[consts_1.PROTOTYPE].hasOwnProperty;
/**
 * has own property
 */
exports.hasOwnProp = proto_1.protoPropSupport
    ? function hasOwnProp(obj, prop) {
        return __hasOwn.call(obj, prop);
    }
    : function hasOwnProp(obj, prop) {
        return prop !== consts_1.PROTO && __hasOwn.call(obj, prop);
    };
/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
function getOwnProp(obj, prop, defaultVal) {
    return exports.hasOwnProp(obj, prop) ? obj[prop] : defaultVal;
}
exports.getOwnProp = getOwnProp;
var __defProp = Object.defineProperty;
/**
 * is support Object.defineProperty
 */
exports.defPropSupport = __defProp &&
    (function () {
        try {
            var val, obj = {};
            __defProp(obj, 's', {
                get: function () {
                    return val;
                },
                set: function (value) {
                    val = value;
                }
            });
            obj.s = 1;
            return obj.s === val;
        }
        catch (e) { }
    })();
if (!exports.defPropSupport) {
    __defProp = function defineProperty(obj, prop, desc) {
        if (desc.get || desc.set) {
            throw new Error('not support getter/setter on defineProperty');
        }
        obj[prop] = desc.value;
        return obj;
    };
}
/**
 * define property
 */
exports.defProp = __defProp;
/**
 * define property by value
 */
exports.defPropValue = exports.defPropSupport
    ? function defPropValue(obj, prop, value, configurable, writable, enumerable) {
        __defProp(obj, prop, {
            value: value,
            enumerable: enumerable !== false,
            configurable: configurable !== false,
            writable: writable !== false
        });
        return value;
    }
    : function defPropValue(obj, prop, value) {
        obj[prop] = value;
        return value;
    };
//# sourceMappingURL=prop.js.map
/**
 * Object.create shim
 * @module utility/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 11:45:30 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var consts_1 = require("./consts");
var prop_1 = require("./prop");
var proto_1 = require("./proto");
function __() { }
/**
 * create shim
 */
function doCreate(o, props) {
    __[consts_1.PROTOTYPE] = o;
    var obj = new __();
    __[consts_1.PROTOTYPE] = null;
    if (props) {
        var k, v;
        for (k in props) {
            if (prop_1.hasOwnProp(props, k)) {
                prop_1.defProp(obj, k, props[k]);
            }
        }
    }
    return obj;
}
/**
 * create object
 */
exports.create = Object.create ||
    (Object.getPrototypeOf
        ? doCreate
        : function create(o, props) {
            var obj = doCreate(o, props);
            proto_1.__setProto(obj, o);
            return obj;
        });
//# sourceMappingURL=create.js.map
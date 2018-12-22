/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:32:10 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var List_1 = require("./List");
var create_1 = require("../create");
var prop_1 = require("../prop");
var DEFAULT_FN_BINDING = '__id__';
var DEFAULT_SCOPE_BINDING = '__id__';
var FnList = /** @class */ (function () {
    function FnList(fnBinding, scopeBinding) {
        this.nodeMap = create_1.create(null);
        this.list = new List_1.List();
        this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
        this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
    }
    FnList.prototype.add = function (fn, scope) {
        scope = parseScope(scope);
        var _a = this, list = _a.list, nodeMap = _a.nodeMap;
        var id = nodeId(this, fn, scope);
        var node = nodeMap[id];
        if (!node) {
            node = [id, fn, scope];
            var ret = list.add(node);
            if (ret)
                nodeMap[id] = node;
            return ret;
        }
        return -1;
    };
    FnList.prototype.remove = function (fn, scope) {
        var _a = this, list = _a.list, nodeMap = _a.nodeMap;
        var id = nodeId(this, fn, parseScope(scope));
        var node = nodeMap[id];
        if (node) {
            nodeMap[id] = undefined;
            return list.remove(node);
        }
        return -1;
    };
    FnList.prototype.has = function (fn, scope) {
        return !!this.nodeMap[nodeId(this, fn, parseScope(scope))];
    };
    FnList.prototype.size = function () {
        return this.list.size();
    };
    FnList.prototype.clean = function () {
        this.nodeMap = create_1.create(null);
        this.list.clean();
    };
    FnList.prototype.each = function (cb, scope) {
        cb = cb.bind(scope);
        this.list.each(function (node) { return cb(node[1], node[2]); });
    };
    FnList.fnBinding = DEFAULT_FN_BINDING;
    FnList.scopeBinding = DEFAULT_SCOPE_BINDING;
    return FnList;
}());
exports.FnList = FnList;
var DEFAULT_SCOPE_ID = 1;
var scopeIdGenerator = 1, fnIdGenerator = 0;
function nodeId(list, fn, scope) {
    var fnBinding = list.fnBinding, scopeBinding = list.scopeBinding;
    var fnId = fn[fnBinding], scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID;
    if (!fnId)
        fnId = prop_1.defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false);
    if (!scopeId)
        scopeId = prop_1.defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false);
    return fnId + "&" + scopeId;
}
function parseScope(scope) {
    return !scope ? undefined : scope;
}
//# sourceMappingURL=FnList.js.map
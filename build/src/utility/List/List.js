/**
 * Double Linked List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:25:11 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var fn_1 = require("../fn");
var prop_1 = require("../prop");
var assert_1 = require("../assert");
var consts_1 = require("../consts");
var DEFAULT_BINDING = '__this__';
//type ListNode = [ListElement, IListNode, IListNode, List]
var List = /** @class */ (function () {
    function List(binding) {
        this.length = 0;
        this.scaning = false;
        this.binding = binding || DEFAULT_BINDING;
    }
    List.prototype.size = function () {
        return this.length;
    };
    List.prototype.has = function (obj) {
        var node = obj[this.binding];
        return node ? node[0] === obj && node[3] === this : false;
    };
    List.prototype.add = function (obj) {
        return this.__insert(obj, this.tail);
    };
    List.prototype.addFirst = function (obj) {
        return this.__insert(obj);
    };
    List.prototype.insertAfter = function (obj, target) {
        return this.__insert(obj, target && this.__getNode(target));
    };
    List.prototype.insertBefore = function (obj, target) {
        return this.__insert(obj, target && this.__getNode(target)[1]);
    };
    List.prototype.addAll = function (objs) {
        return this.__insertAll(objs, this.tail);
    };
    List.prototype.addFirstAll = function (objs) {
        return this.__insertAll(objs);
    };
    List.prototype.insertAfterAll = function (objs, target) {
        return this.__insertAll(objs, target && this.__getNode(target));
    };
    List.prototype.insertBeforeAll = function (objs, target) {
        return this.__insertAll(objs, target && this.__getNode(target)[1]);
    };
    List.prototype.prev = function (obj) {
        return this.__siblingObj(obj, 1);
    };
    List.prototype.next = function (obj) {
        return this.__siblingObj(obj, 2);
    };
    List.prototype.first = function () {
        var node = this.head;
        return node && node[0];
    };
    List.prototype.last = function () {
        var node = this.tail;
        return node && node[0];
    };
    List.prototype.each = function (cb, scope) {
        if (this.length) {
            assert_1.assert.not(this.scaning, 'Recursive calls are not allowed.');
            this.scaning = true;
            cb = fn_1.bind(cb, scope);
            var node = this.head;
            while (node) {
                if (node[3] === this && cb(node[0]) === false)
                    break;
                node = node[2];
            }
            this.__doLazyRemove();
            this.scaning = false;
        }
    };
    List.prototype.toArray = function () {
        var array = new Array(this.length);
        var node = this.head, i = 0;
        while (node) {
            if (node[3] === this)
                array[i++] = node[0];
            node = node[2];
        }
        return array;
    };
    List.prototype.remove = function (obj) {
        return this.__remove(this.__getNode(obj));
    };
    List.prototype.pop = function () { };
    List.prototype.clean = function () {
        if (this.length) {
            if (this.scaning) {
                var node = this.head;
                while (node) {
                    node[3] === this && this.__lazyRemove(node);
                    node = node[2];
                }
                this.length = 0;
            }
            else {
                this.__clean();
            }
        }
    };
    List.prototype.__initNode = function (obj) {
        var binding = this.binding;
        var node = obj[binding];
        if (node && node[0] === obj) {
            if (node[3] === this) {
                this.__remove(node);
                return this.__initNode(obj);
            }
            else if (node[3]) {
                assert_1.assert('Object is still in some List');
            }
        }
        else {
            node = [obj];
            node.toJSON = consts_1.EMPTY_FN;
            prop_1.defPropValue(obj, binding, node, false);
        }
        node[3] = this;
        return node;
    };
    List.prototype.__getNode = function (obj) {
        var node = obj[this.binding];
        assert_1.assert.is(node && node[3] === this, 'Object is not in this List');
        return node;
    };
    List.prototype.__siblingObj = function (obj, siblingIdx) {
        var node = this.__getNode(obj);
        var sibling = node[siblingIdx];
        if (sibling) {
            while (!sibling[3]) {
                sibling = sibling[siblingIdx];
                if (!sibling)
                    return;
            }
            return sibling[0];
        }
    };
    List.prototype.__doInsert = function (nodeHead, nodeTail, len, prev) {
        var next;
        nodeHead[1] = prev;
        if (prev) {
            nodeTail[2] = next = prev[2];
            prev[2] = nodeHead;
        }
        else {
            nodeTail[2] = next = this.head;
            this.head = nodeHead;
        }
        if (next)
            next[1] = nodeTail;
        else
            this.tail = nodeTail;
        return (this.length += len);
    };
    List.prototype.__insert = function (obj, prev) {
        var node = this.__initNode(obj);
        return this.__doInsert(node, node, 1, prev);
    };
    List.prototype.__insertAll = function (objs, prev) {
        var l = objs.length;
        if (l) {
            var head = this.__initNode(objs[0]);
            var __prev = head, tail = head, i = 1;
            for (; i < l; i++) {
                tail = this.__initNode(objs[i]);
                tail[1] = __prev;
                __prev[2] = tail;
                __prev = tail;
            }
            return this.__doInsert(head, tail, l, prev);
        }
        return -1;
    };
    List.prototype.__remove = function (node) {
        this.scaning ? this.__lazyRemove(node) : this.__doRemove(node);
        return --this.length;
    };
    List.prototype.__lazyRemove = function (node) {
        var lazyRemoves = this.lazyRemoves;
        node[0][this.binding] = undefined; // unbind this node
        node[3] = null;
        if (lazyRemoves) {
            lazyRemoves.push(node);
        }
        else {
            this.lazyRemoves = [node];
        }
    };
    List.prototype.__doLazyRemove = function () {
        var lazyRemoves = this.lazyRemoves;
        if (lazyRemoves) {
            var len = lazyRemoves.length;
            if (len) {
                if (this.length) {
                    while (len--)
                        this.__doRemove(lazyRemoves[len]);
                }
                else {
                    this.__clean();
                }
                lazyRemoves.length = 0;
            }
        }
    };
    List.prototype.__doRemove = function (node) {
        var prev = node[1], next = node[2];
        if (prev) {
            prev[2] = next;
        }
        else {
            this.head = next;
        }
        if (next) {
            next[1] = prev;
        }
        else {
            this.tail = prev;
        }
        node[1] = node[2] = node[3] = null;
    };
    List.prototype.__clean = function () {
        var node, next = this.head;
        while ((node = next)) {
            next = node[2];
            node.length = 1;
        }
        this.head = undefined;
        this.tail = undefined;
        this.length = 0;
    };
    List.binding = DEFAULT_BINDING;
    return List;
}());
exports.List = List;
//# sourceMappingURL=List.js.map
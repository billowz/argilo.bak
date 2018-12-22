exports.__esModule = true;
var List_1 = require("../List");
var propPath_1 = require("../../propPath");
var assert_1 = require("../../assert");
function createTestObjs(size) {
    var objs = new Array(size), i = 0;
    for (; i < size; i++)
        objs[i] = {
            i: i
        };
    return objs;
}
describe('List', function () {
    it('add', function () {
        var list = new List_1.List(), objs = createTestObjs(10), i = 0, l = objs.length;
        function checkList() {
            var i = 0, l = objs.length;
            assert_1.assert.eq(list.size(), l);
            for (i = 0; i < l; i++) {
                assert_1.assert.eq(list.has(objs[i]), true);
            }
            i = 0;
            var num = 0;
            list.each(function (obj) {
                assert_1.assert.eq(objs[i++], obj);
                num++;
            });
            assert_1.assert.eq(num, l);
            assert_1.assert.eq(propPath_1.get(list, 'head[0]'), objs[0]);
            assert_1.assert.eq(propPath_1.get(list, 'tail[0]'), objs[l - 1]);
            var node = propPath_1.get(list, 'head');
            for (i = 0; i < l; i++) {
                assert_1.assert.eq(node[0], objs[i]);
                node = node[2];
            }
        }
        assert_1.assert.eq(propPath_1.get(list, 'head'), undefined);
        assert_1.assert.eq(propPath_1.get(list, 'tail'), undefined);
        assert_1.assert.eq(list.size(), 0);
        // add
        for (; i < l; i++)
            assert_1.assert.eq(list.add(objs[i]), i + 1);
        checkList();
        // readd
        for (; i < l; i++)
            assert_1.assert.eq(list.add(objs), false);
        checkList();
    });
    it('remove', function () {
        var list = new List_1.List(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i]);
        // remove
        var removed = 0;
        for (i = 0; i < l; i += 2) {
            removed++;
            assert_1.assert.eq(list.has(objs[i]), true);
            assert_1.assert.eq(list.remove(objs[i]), l - removed);
            assert_1.assert.eq(list.has(objs[i]), false);
            assert_1.assert.eq(list.size(), l - removed);
        }
        for (i = 0; i < l; i++) {
            if (i % 2 === 0) {
                assert_1.assert.eq(list.has(objs[i]), false);
                assert_1.assert["throw"](function () { return list.remove(objs[i]); }, 'Object is not in this List');
            }
            else {
                removed++;
                assert_1.assert.eq(list.has(objs[i]), true);
                assert_1.assert.eq(list.remove(objs[i]), l - removed);
                assert_1.assert.eq(list.has(objs[i]), false);
            }
            assert_1.assert.eq(list.size(), l - removed);
        }
        assert_1.assert.eq(propPath_1.get(list, 'head'), undefined);
        assert_1.assert.eq(propPath_1.get(list, 'tail'), undefined);
        assert_1.assert.eq(list.size(), 0);
    });
    it('remove in scaning', function () {
        var list = new List_1.List(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i]);
        // remove
        var removed = 0;
        i = 0;
        list.each(function (obj) {
            if (i % 2 === 0) {
                removed += 1;
                assert_1.assert.eq(objs[i], obj);
                assert_1.assert.eq(list.has(obj), true);
                assert_1.assert.eq(list.remove(obj), l - removed);
                assert_1.assert.eq(list.has(obj), false);
                assert_1.assert.eq(list.size(), l - removed);
            }
            i++;
        });
        assert_1.assert.eq(list.size(), l / 2);
        list.each(function (obj) {
            removed += 1;
            assert_1.assert.eq(list.has(obj), true);
            assert_1.assert.eq(list.remove(obj), l - removed);
            assert_1.assert.eq(list.has(obj), false);
            assert_1.assert.eq(list.size(), l - removed);
        });
        assert_1.assert.eq(propPath_1.get(list, 'head'), undefined);
        assert_1.assert.eq(propPath_1.get(list, 'tail'), undefined);
        assert_1.assert.eq(list.size(), 0);
    });
    it('clean', function () {
        var list = new List_1.List(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i]);
        list.clean();
        for (i = 0; i < l; i++)
            assert_1.assert.eq(list.has(objs[i]), false);
        assert_1.assert.eq(propPath_1.get(list, 'head'), undefined);
        assert_1.assert.eq(propPath_1.get(list, 'tail'), undefined);
        assert_1.assert.eq(list.size(), 0);
    });
    it('clean in scaning', function () {
        var list = new List_1.List(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i]);
        list.each(function (fn) {
            list.clean();
        });
        for (i = 0; i < l; i++)
            assert_1.assert.eq(list.has(objs[i]), false);
        assert_1.assert.eq(propPath_1.get(list, 'head'), undefined);
        assert_1.assert.eq(propPath_1.get(list, 'tail'), undefined);
        assert_1.assert.eq(list.size(), 0);
    });
});
//# sourceMappingURL=List.spec.js.map
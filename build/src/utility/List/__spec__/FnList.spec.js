exports.__esModule = true;
var FnList_1 = require("../FnList");
var assert_1 = require("../../assert");
function createTestObjs(size) {
    var objs = new Array(size), i = 0;
    for (; i < size; i++)
        objs[i] = {
            i: i,
            fn: (function (i) {
                return function () {
                    return i;
                };
            })(i)
        };
    return objs;
}
describe('FnList', function () {
    it('add', function () {
        var list = new FnList_1.FnList(), objs = createTestObjs(10), i = 0, l = objs.length;
        function checkList() {
            var i = 0, l = objs.length;
            assert_1.assert.eq(list.size(), l);
            for (i = 0; i < l; i++) {
                assert_1.assert.eq(list.has(objs[i].fn, objs[i]), true);
                assert_1.assert.eq(list.has(objs[i].fn), false);
            }
            i = 0;
            list.each(function (fn, scope) {
                var obj = objs[i++];
                assert_1.assert.eq(fn, obj.fn);
                assert_1.assert.eq(scope, obj);
            });
        }
        assert_1.assert.eq(list.size(), 0);
        // add
        for (; i < l; i++)
            assert_1.assert.eq(list.add(objs[i].fn, objs[i]), i + 1);
        checkList();
        // readd
        for (; i < l; i++)
            assert_1.assert.eq(list.add(objs[i].fn, objs[i]), false);
        checkList();
    });
    it('remove', function () {
        var list = new FnList_1.FnList(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i].fn, objs[i]);
        // remove
        var removed = 0;
        for (i = 0; i < l; i += 2) {
            removed++;
            assert_1.assert.eq(list.remove(objs[i].fn), -1);
            assert_1.assert.eq(list.has(objs[i].fn, objs[i]), true);
            assert_1.assert.eq(list.remove(objs[i].fn, objs[i]), l - removed);
            assert_1.assert.eq(list.has(objs[i].fn, objs[i]), false);
            assert_1.assert.eq(list.size(), l - removed);
        }
        for (i = 0; i < l; i++) {
            if (i % 2 === 0) {
                assert_1.assert.eq(list.remove(objs[i].fn, objs[i]), -1);
            }
            else {
                removed++;
                assert_1.assert.eq(list.remove(objs[i].fn), -1);
                assert_1.assert.eq(list.has(objs[i].fn, objs[i]), true);
                assert_1.assert.eq(list.remove(objs[i].fn, objs[i]), l - removed);
            }
            assert_1.assert.eq(list.has(objs[i].fn, objs[i]), false);
            assert_1.assert.eq(list.size(), l - removed);
        }
        assert_1.assert.eq(list.size(), 0);
    });
    it('remove in scaning', function () {
        var list = new FnList_1.FnList(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i].fn, objs[i]);
        // remove
        var removed = 0;
        i = 0;
        list.each(function (fn, scope) {
            if (i % 2 === 0) {
                removed += 1;
                assert_1.assert.eq(list.remove(fn), -1);
                assert_1.assert.eq(list.has(fn, scope), true);
                assert_1.assert.eq(list.remove(fn, scope), l - removed);
                assert_1.assert.eq(list.has(fn, scope), false);
                assert_1.assert.eq(list.size(), l - removed);
            }
            i++;
        });
        assert_1.assert.eq(list.size(), l / 2);
        list.each(function (fn, scope) {
            removed += 1;
            assert_1.assert.eq(list.remove(fn), -1);
            assert_1.assert.eq(list.has(fn, scope), true);
            assert_1.assert.eq(list.remove(fn, scope), l - removed);
            assert_1.assert.eq(list.has(fn, scope), false);
            assert_1.assert.eq(list.size(), l - removed);
        });
        assert_1.assert.eq(list.size(), 0);
    });
    it('clean', function () {
        var list = new FnList_1.FnList(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i].fn, objs[i]);
        list.clean();
        for (i = 0; i < l; i++)
            assert_1.assert.eq(list.has(objs[i].fn, objs[i]), false);
        assert_1.assert.eq(list.size(), 0);
    });
    it('clean in scaning', function () {
        var list = new FnList_1.FnList(), objs = createTestObjs(10), i = 0, l = objs.length;
        // init
        for (; i < l; i++)
            list.add(objs[i].fn, objs[i]);
        list.each(function (fn, scope) {
            list.clean();
        });
        for (i = 0; i < l; i++)
            assert_1.assert.eq(list.has(objs[i].fn, objs[i]), false);
        assert_1.assert.eq(list.size(), 0);
    });
});
//# sourceMappingURL=FnList.spec.js.map
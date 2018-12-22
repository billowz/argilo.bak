exports.__esModule = true;
var FnList_1 = require("../FnList");
suite('create FnList', function () {
    benchmark('new FnList', function () {
        var list = new FnList_1.FnList();
    });
    benchmark('new Array', function () {
        var arr = [];
    });
});
perf(10);
perf(100);
perf(1000);
perf(10000);
function createTestObjs(size) {
    var objs = new Array(size), i = 0;
    function fn() { }
    for (; i < size; i++)
        objs[i] = {
            fn: fn,
            scope: undefined
        };
    return objs;
}
function perf(listSize) {
    suite('add empty FnList x' + listSize, function () {
        benchmark('FnList.add', function () {
            var objs = createTestObjs(listSize);
            var list = new FnList_1.FnList();
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                list.add(obj.fn, obj.scope);
            }
        });
        benchmark('Array.push', function () {
            var objs = createTestObjs(listSize);
            var array = [];
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                addArray(array, obj.fn, obj.scope);
            }
        });
    });
    suite('add full FnList x' + listSize, function () {
        var objs = createTestObjs(listSize), list = new FnList_1.FnList(), array = objs.slice();
        for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
            obj = objs[i];
            list.add(obj.fn, obj.scope);
        }
        benchmark('FnList.add', function () {
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                list.add(obj.fn, obj.scope);
            }
        });
        benchmark('Array.push', function () {
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                addArray(array, obj.fn, obj.scope);
            }
        });
    });
    suite('add & remove FnList x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new FnList_1.FnList();
        benchmark('FnList.add & FnList.remove', function () {
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                list.add(obj.fn, obj.scope);
            }
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                list.remove(obj.fn, obj.scope);
            }
        });
        benchmark('Array.slice & Array.splice', function () {
            var array = objs.slice();
            for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
                obj = objs[i];
                removeArray(array, obj.fn, obj.scope);
            }
        });
    });
    suite('add & rev-remove FnList x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new FnList_1.FnList();
        benchmark('FnList.add & FnList.remove', function () {
            for (var i_1 = 0, l = objs.length, obj_1; i_1 < l; i_1++) {
                obj_1 = objs[i_1];
                list.add(obj_1.fn, obj_1.scope);
            }
            var i = objs.length, obj;
            while (i--) {
                obj = objs[i];
                list.remove(obj.fn, obj.scope);
            }
        });
        benchmark('Array.slice && Array.splice', function () {
            var array = objs.slice();
            var i = objs.length, obj;
            while (i--) {
                obj = objs[i];
                removeArray(array, obj.fn, obj.scope);
            }
        });
    });
    suite('each FnList x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new FnList_1.FnList();
        for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
            obj = objs[i];
            list.add(obj.fn, obj.scope);
        }
        var nr1 = 0, nr2 = 0;
        function cb1(fn, scope) {
            nr1++;
        }
        function cb2(fn, scope) {
            nr2++;
        }
        benchmark('FnList.each', function () {
            list.each(cb1);
            nr1 = 0;
        });
        benchmark('each Array', function () {
            var array = objs.slice();
            for (var i = 0, l = array.length, obj = void 0; i < l; i++) {
                obj = array[i];
                cb2(obj.fn, obj.scope);
            }
            nr2 = 0;
        });
    });
    suite('run FnList x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var objs2 = createTestObjs(listSize);
        var list = new FnList_1.FnList();
        for (var i = 0, l = objs.length, obj = void 0; i < l; i++) {
            obj = objs[i];
            obj.fn = cb1;
            list.add(obj.fn, obj.scope);
        }
        for (var i = 0, l = objs2.length; i < l; i++) {
            objs2[i].fn = cb2;
        }
        var nr1 = 0, nr2 = 0;
        function cb1(a) {
            nr1++;
        }
        function cb2(a) {
            nr2++;
        }
        benchmark('FnList.run', function () {
            list.each(function (fn, scope) { return fn.call(scope, 1); });
            nr1 = 0;
        });
        benchmark('each Array & callback', function () {
            var array = objs2.slice();
            for (var i = 0, l = array.length, obj = void 0; i < l; i++) {
                obj = array[i];
                obj.fn.call(obj.scope, 2);
            }
            nr2 = 0;
        });
    });
}
function addArray(array, fn, scope) {
    var i = array.length;
    while (i--) {
        if (array[i].fn === fn && array[i].scope === scope)
            break;
    }
    if (i === -1) {
        array.push({
            fn: fn,
            scope: scope
        });
    }
}
function removeArray(array, fn, scope) {
    var i = array.length;
    while (i--) {
        if (array[i].fn === fn && array[i].scope === scope) {
            array.splice(i, 1);
            return;
        }
    }
}
//# sourceMappingURL=FnList.perf.js.map
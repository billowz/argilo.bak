exports.__esModule = true;
var List_1 = require("../List");
suite('create list', function () {
    benchmark('new List', function () {
        var list = new List_1.List();
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
    for (; i < size; i++) {
        objs[i] = {
            i: i
        };
    }
    return objs;
}
function perf(listSize) {
    suite('add empty list x' + listSize, function () {
        benchmark('List.add', function () {
            var objs = createTestObjs(listSize);
            var list = new List_1.List();
            for (var i = 0, l = objs.length; i < l; i++) {
                list.add(objs[i]);
            }
        });
        benchmark('Array.push', function () {
            var objs = createTestObjs(listSize);
            var array = [];
            for (var i = 0, l = objs.length; i < l; i++) {
                addArray(array, objs[i]);
            }
        });
    });
    suite('add full list x' + listSize, function () {
        var objs = createTestObjs(listSize), list = new List_1.List(), array = objs.slice();
        for (var i = 0, l = objs.length; i < l; i++) {
            list.add(objs[i]);
        }
        benchmark('List.add', function () {
            for (var i = 0, l = objs.length; i < l; i++) {
                list.add(objs[i]);
            }
        });
        benchmark('Array.push', function () {
            for (var i = 0, l = objs.length; i < l; i++) {
                addArray(array, objs[i]);
            }
        });
    });
    suite('add & remove list x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new List_1.List();
        benchmark('List.add & List.remove', function () {
            for (var i = 0, l = objs.length; i < l; i++) {
                list.add(objs[i]);
            }
            for (var i = 0, l = objs.length; i < l; i++) {
                list.remove(objs[i]);
            }
        });
        benchmark('Array.slice & Array.splice', function () {
            var array = objs.slice();
            for (var i = 0, l = objs.length; i < l; i++) {
                removeArray(array, objs[i]);
            }
        });
    });
    suite('add & rev-remove list x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new List_1.List();
        benchmark('List.add & List.remove', function () {
            for (var i_1 = 0, l = objs.length; i_1 < l; i_1++) {
                list.add(objs[i_1]);
            }
            var i = objs.length;
            while (i--) {
                list.remove(objs[i]);
            }
        });
        benchmark('Array.slice & Array.splice', function () {
            var array = objs.slice();
            var i = objs.length;
            while (i--) {
                removeArray(array, objs[i]);
            }
        });
    });
    suite('each list x' + listSize, function () {
        var objs = createTestObjs(listSize);
        var list = new List_1.List();
        for (var i = 0, l = objs.length; i < l; i++) {
            list.add(objs[i]);
        }
        var nr1 = 0, nr2 = 0;
        function cb1(v) {
            nr1++;
        }
        function cb2(v) {
            nr2++;
        }
        benchmark('List.each', function () {
            list.each(cb1);
            nr1 = 0;
        });
        benchmark('each Array', function () {
            var array = objs.slice();
            for (var i = 0, l = array.length; i < l; i++) {
                cb2(array[i]);
            }
            nr2 = 0;
        });
    });
}
function addArray(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj)
            break;
    }
    if (i === -1) {
        array.push(obj);
    }
}
function removeArray(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj) {
            array.splice(i, 1);
            return;
        }
    }
}
//# sourceMappingURL=List.perf.js.map
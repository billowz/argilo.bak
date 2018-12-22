exports.__esModule = true;
var is_1 = require("../is");
suite("isBool", function () {
    bench(false);
    bench({}, '{}');
    function bench(v, name) {
        benchmark("argilo.isBool: " + (name || v), function () {
            is_1.isBool(v);
        });
        benchmark("argilo.is: " + (name || v), function () {
            is_1.is(v, Boolean);
        });
        benchmark("compare: " + (name || v), function () {
            compare(v);
        });
        benchmark("typeof: " + (name || v), function () {
            type(v);
        });
        benchmark("instance: " + (name || v), function () {
            inst(v);
        });
        benchmark("Object.prototype.toString: " + (name || v), function () {
            str(v);
        });
    }
    var type = _typeof("boolean");
    var inst = _is(Boolean);
    var str = _str("[object Boolean]");
    function compare(v) {
        return v === true || v === false;
    }
});
suite("isInteger", function () {
    bench(0);
    bench(1);
    bench(1.1);
    bench('0', '"0"');
    function bench(v, name) {
        benchmark("argilo.isInt: " + (name || v), function () {
            is_1.isInt(v);
        });
        benchmark("parseInt: " + (name || v), function () {
            _isInt(v);
        });
        if (Number.isInteger)
            benchmark("Number.isInteger: " + (name || v), function () {
                Number.isInteger(v);
            });
    }
    function _isInt(v) {
        return typeof v === 'number' && v % 1 === 0;
    }
});
suite("isArray", function () {
    bench([], '[]');
    bench(arguments, 'arguments');
    function bench(v, name) {
        benchmark("argilo.isArray: " + (name || v), function () {
            is_1.isArray(v);
        });
        benchmark("argilo.is: " + (name || v), function () {
            is_1.is(v, Array);
        });
        benchmark("Array.isArray: " + (name || v), function () {
            Array.isArray(v);
        });
        benchmark("instance: " + (name || v), function () {
            inst(v);
        });
        benchmark("instanceof: " + (name || v), function () {
            instof(v);
        });
        benchmark("Object.prototype.toString: " + (name || v), function () {
            str(v);
        });
    }
    var inst = _is(Array);
    var str = _str("[object Array]");
    function instof(v) {
        v instanceof Array;
    }
});
function getArgs() {
    return arguments;
}
suite("isArrayLike", function () {
    bench([], '[0]');
    if (typeof Float32Array !== 'undefined') {
        bench(new Float32Array([1, 2]), 'Float32[2]');
    }
    bench(getArgs(), 'arguments[0]');
    bench(getArgs(1, 2, 3), 'arguments[3]');
    bench({ length: 1, 0: 1 }, '{1}');
    bench({ length: 1 }, '{!1}');
    bench({}, '{undefined}');
    bench({ length: function () { }, 0: 1 }, '{fn}');
    function bench(v, name) {
        benchmark("argilo.isArrayLike: " + (name || v), function () {
            is_1.isArrayLike(v);
        });
        benchmark("instance + length: " + (name || v), function () {
            inst(v);
        });
        benchmark("Object.prototype.toString: " + (name || v), function () {
            str(v);
        });
    }
    function inst(obj) {
        if (obj === undefined && obj === null)
            return false;
        switch (obj.constructor) {
            case Array:
            case String:
            case NodeList:
            case HTMLCollection:
                return true;
        }
        var len = obj.length;
        return typeof len === 'number' && (!len || (len > 0 && len % 1 === 0 && len - 1 in obj));
    }
    var reg = /Array\]$/;
    function str(obj) {
        var str = toStr.call(obj);
        switch (str) {
            case "[object String]":
            case "[object Array]":
            case "[object Arguments]":
            case "[object NodeList]":
            case "[object HTMLCollection]":
                return true;
        }
        var len = obj.length;
        return typeof len === 'number' && (!len || (len > 0 && len % 1 === 0 && len - 1 in obj));
    }
});
function _typeof(type) {
    return function (obj) { return typeof obj === type; };
}
function _is(Type) {
    return function (obj) { return obj !== undefined && obj !== null && obj.constructor === Type; };
}
var toStr = Object.prototype.toString;
function _str(fmt) {
    return function (obj) { return toStr.call(obj) === fmt; };
}
//# sourceMappingURL=is.perf.js.map
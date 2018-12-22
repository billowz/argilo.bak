exports.__esModule = true;
var fn_1 = require("../fn");
bench(undefined, 0);
bench({}, 0);
bench(undefined, 5);
bench({}, 5);
bench(undefined, 8);
bench({}, 8);
bench(undefined, 10);
bench({}, 10);
function bench(scope, argLen) {
    var fn = fnBuilder(argLen)();
    var args = new Array(argLen);
    var i;
    for (i = 0; i < argLen; i++)
        args[i] = i + 1;
    var tokens = new Array(argLen);
    for (i = 0; i < argLen; i++)
        tokens[i] = "args[" + i + "]";
    var call = fn_1.createFn("fn.call(scope" + (tokens.length ? ',' + tokens.join(',') : '') + ")", ['fn', 'scope', 'args']);
    var execute = fn_1.createFn("fn(" + tokens.join(',') + ")", ['fn', 'args']);
    suite("call function " + (scope ? 'with' : 'without') + " scope by x" + argLen + " argument" + (argLen > 1 ? 's' : ''), function () {
        benchmark('argilo.apply', function () {
            fn_1.apply(fn, scope, args);
        });
        benchmark('argilo.applyN', function () {
            fn_1.applyN(fn, scope, args, 0, args.length);
        });
        if (scope) {
            benchmark('argilo.applyScope', function () {
                fn_1.applyScope(fn, scope, args);
            });
            benchmark('argilo.applyScopeN', function () {
                fn_1.applyScopeN(fn, scope, args, 0, args.length);
            });
        }
        else {
            benchmark('argilo.applyNoScope', function () {
                fn_1.applyNoScope(fn, args);
            });
            benchmark('argilo.applyNoScopeN', function () {
                fn_1.applyNoScopeN(fn, args, 0, args.length);
            });
        }
        benchmark('Function.apply', function () {
            fn.apply(scope, args);
        });
        benchmark('Function.call', function () {
            call(fn, scope, args);
        });
        if (!scope) {
            benchmark('execute', function () {
                execute(fn, args);
            });
        }
    });
}
function fnBuilder(argLen) {
    var tokens = new Array(argLen);
    while (argLen--)
        tokens[argLen] = 'a' + argLen;
    return fn_1.createFn("\n    return function(" + tokens.join(', ') + "){\n      return " + tokens.join(' + ') + " + 1\n    }\n");
}
//# sourceMappingURL=function.perf.js.map
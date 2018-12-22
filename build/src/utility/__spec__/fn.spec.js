var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var fn_1 = require("../fn");
describe('utility/fn', function () {
    describe('bind', function () {
        it('bind scope');
        it('bind arguments');
        it('bind scope + arguments');
    });
    it('createFn', function () {
        function A() { }
        var fn1 = fn_1.createFn("return 1;");
        var fn2 = fn_1.createFn("return 2;", [], 'aaa');
        var fn3 = fn_1.createFn("return a + 2;", ['a']);
        var fn4 = fn_1.createFn("return a +b+ 2;", ['a', 'b'], 'bbb');
        expect_js_1["default"](fn1()).to.equal(1);
        expect_js_1["default"](fn2()).to.equal(2);
        expect_js_1["default"](fn3(1)).to.equal(3);
        expect_js_1["default"](fn4(1, 1)).to.equal(4);
        if (fn_1.fnName(A) === 'A') {
            expect_js_1["default"](fn_1.fnName(fn2)).to.equal('aaa');
            expect_js_1["default"](fn_1.fnName(fn4)).to.equal('bbb');
        }
    });
    describe('apply', function () {
        function createApplyFunc(scope, args, cb) {
            if (cb) {
                cb(applyFn, scope, args);
            }
            return applyFn;
            function applyFn() {
                expect_js_1["default"](Array.prototype.slice.call(arguments)).to.eql(args);
                if (scope === undefined || scope === null) {
                    expect_js_1["default"](!this || (typeof window !== 'undefined' && this === window) || this === global).to.equal(true);
                }
                else {
                    expect_js_1["default"](this).to.equal(scope);
                }
                var i = arguments.length, ret = 0;
                while (i--) {
                    ret += arguments[i];
                }
                return ret;
            }
        }
        it('apply scope + arguments', function () {
            createApplyFunc({}, [1, 2], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyScope(fn, scope, args)).to.equal(3);
                expect_js_1["default"](fn_1.apply(fn, scope, args)).to.equal(3);
            });
            createApplyFunc(new Number(1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyScope(fn, scope, args)).to.equal(55);
                expect_js_1["default"](fn_1.apply(fn, scope, args)).to.equal(55);
            });
        });
        it('apply arguments', function () {
            createApplyFunc(undefined, [1, 2], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyNoScope(fn, args)).to.equal(3);
                expect_js_1["default"](fn_1.apply(fn, undefined, args)).to.equal(3);
                expect_js_1["default"](fn_1.apply(fn, null, args)).to.equal(3);
            });
            createApplyFunc(undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyNoScope(fn, args)).to.equal(55);
                expect_js_1["default"](fn_1.apply(fn, undefined, args)).to.equal(55);
                expect_js_1["default"](fn_1.apply(fn, null, args)).to.equal(55);
            });
        });
        it('apply scope + arguments with offset/length', function () {
            createApplyFunc(new String('abc'), [2, 3], function (fn, scope) {
                expect_js_1["default"](fn_1.applyScopeN(fn, scope, [1, 2, 3, 4], 1, 2)).to.equal(5);
                expect_js_1["default"](fn_1.applyN(fn, scope, [1, 2, 2, 3, 4, 5], 2, 2)).to.equal(5);
            });
            createApplyFunc(new Number(0), [2, 3, 4, 5, 6, 7, 8, 9], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyScopeN(fn, scope, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44);
                expect_js_1["default"](fn_1.applyN(fn, scope, [2, 3, 4, 5, 6, 7, 8, 9, 10], 0, 8)).to.equal(44);
            });
        });
        it('apply arguments with offset/length', function () {
            createApplyFunc(undefined, [2, 3], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyNoScopeN(fn, [1, 2, 3, 4], 1, 2)).to.equal(5);
                expect_js_1["default"](fn_1.applyN(fn, undefined, [1, 2, 3, 4], 1, 2)).to.equal(5);
                expect_js_1["default"](fn_1.applyN(fn, null, [1, 2, 3, 4], 1, 2)).to.equal(5);
            });
            createApplyFunc(undefined, [2, 3, 4, 5, 6, 7, 8, 9], function (fn, scope, args) {
                expect_js_1["default"](fn_1.applyNoScopeN(fn, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44);
                expect_js_1["default"](fn_1.applyN(fn, undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44);
                expect_js_1["default"](fn_1.applyN(fn, null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44);
            });
        });
    });
    describe('bind', function () {
        it('bind scope');
        it('bind arguments');
        it('bind scope + arguments');
    });
});
//# sourceMappingURL=fn.spec.js.map
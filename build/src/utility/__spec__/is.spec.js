var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var consts_1 = require("../consts");
var is_1 = require("../is");
function getArgs() {
    return arguments;
}
var typeTests = {
    isNull: {
        is: is_1.isNull,
        vals: [null]
    },
    isUndf: {
        is: is_1.isUndef,
        vals: [undefined]
    },
    isFn: {
        is: is_1.isFn,
        vals: [function () { }, new Function('return true;'), Object, Function, Array, Number]
    },
    isBoolean: {
        is: is_1.isBoolean,
        type: Boolean,
        vals: [true, false, new Boolean(true), new Boolean(false)]
    },
    isNumber: {
        is: is_1.isNumber,
        type: Number,
        vals: [0, -1, 1, 0.1, NaN, Infinity, -Infinity, 1 / 0, -1 / 0, new Number(1)]
    },
    isString: {
        is: is_1.isString,
        type: String,
        vals: ['', '0', '1', 'true', 'false', 'undefined', 'null', new String('')]
    },
    isObj: {
        is: is_1.isObj,
        type: Object,
        vals: [{}, { a: 1 }, new Object(), create({}), create(null)]
    },
    isDate: {
        is: is_1.isDate,
        type: Date,
        vals: [new Date()]
    },
    isReg: {
        is: is_1.isReg,
        type: RegExp,
        vals: [/^1/, new RegExp('^1')]
    },
    isArray: {
        is: is_1.isArray,
        type: Array,
        vals: [new Array(0), []]
    }
};
var isTests = {
    isInt: {
        is: is_1.isInt,
        vals: [0.0, -1.0, 1.0],
        ivals: [true, false, undefined, 0.1, 1 / 0, -1 / 0, NaN, {}, function () { }]
    },
    isPrimitive: {
        is: is_1.isPrimitive,
        vals: [true, false, 1, -0.1, NaN, '', 'abc', function () { }, undefined, null],
        ivals: [{}, [], new String(), new Boolean(true), new Number(1), /^1/]
    },
    isArrayLike: {
        is: is_1.isArrayLike,
        vals: [
            new Array(0),
            [],
            new Array(10),
            [1, 2, 3],
            '',
            '   ',
            '123',
            getArgs(1, 2, 3),
            { length: 0 },
            { length: 10, '9': undefined }
        ].concat(consts_1.GLOBAL.Int8Array ? [new Int8Array(0)] : []),
        ivals: [1, { length: 10 }, {}]
    },
    isBlank: {
        is: is_1.isBlank,
        vals: ['', '     ', [], new Array(0), getArgs(), { length: 0 }, null, undefined, 0, false].concat(consts_1.GLOBAL.Int8Array ? [new Int8Array(0)] : []),
        ivals: ['a', getArgs(undefined), 1, true, [1], new Array(1), {}].concat(consts_1.GLOBAL.Int8Array ? [new Int8Array(1)] : [])
    },
    isNil: {
        is: is_1.isNil,
        vals: [undefined, null],
        ivals: [0, false, '']
    }
};
describe('utility/is', function () {
    each(typeTests, function (test, name) {
        it(name, function () {
            each(test.vals, function (v, i) {
                expect_js_1["default"](test.is(v)).to.equal(true);
            });
            each(typeTests, function (t) {
                if (t !== test) {
                    each(t.vals, function (v, i) {
                        expect_js_1["default"](test.is(v)).to.equal(false);
                    });
                }
            });
        });
    });
    each(isTests, function (test, name) {
        it(name, function () {
            each(test.vals, function (v, i) {
                expect_js_1["default"](test.is(v)).to.equal(true);
            });
            each(test.ivals, function (v, i) {
                expect_js_1["default"](test.is(v)).to.equal(false);
            });
        });
    });
    if (consts_1.GLOBAL.document) {
        it('isArrayLike: dom collection', function () {
            expect_js_1["default"](is_1.isArrayLike(document.body.children)).to.equal(true);
            expect_js_1["default"](is_1.isArrayLike(document.body.childNodes)).to.equal(true);
        });
    }
    it('is', function () {
        each(typeTests, function (test, name) {
            if (test.type) {
                each(test.vals, function (v, i) {
                    expect_js_1["default"](is_1.is(v, test.type)).to.equal(true);
                });
                each(typeTests, function (t) {
                    if (t !== test) {
                        each(t.vals, function (v, i) {
                            expect_js_1["default"](is_1.is(v, test.type)).to.equal(false);
                        });
                    }
                });
            }
        });
        expect_js_1["default"](is_1.is(true, [Boolean, Number, String, Date])).to.equal(true);
        expect_js_1["default"](is_1.is(1, [Boolean, Number, String, Date])).to.equal(true);
        expect_js_1["default"](is_1.is('1', [Boolean, Number, String, Date])).to.equal(true);
        expect_js_1["default"](is_1.is(new Date(), [Boolean, Number, String, Date])).to.equal(true);
        expect_js_1["default"](is_1.is({}, [Boolean, Number, String, Date])).to.equal(false);
        expect_js_1["default"](is_1.is(/^1/, [Boolean, Number, String, Date])).to.equal(false);
    });
    it('eq', function () {
        expect_js_1["default"](is_1.eq(NaN, NaN)).to.equal(true);
        expect_js_1["default"](is_1.eq(0, null)).to.equal(false);
        expect_js_1["default"](is_1.eq(1, '1')).to.equal(false);
    });
});
function each(o, cb) {
    if (o instanceof Array) {
        for (var i = 0, l = o.length; i < l; i++) {
            cb(o[i], i);
        }
    }
    else {
        for (var k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
                cb(o[k], k);
            }
        }
    }
}
function create(o) {
    function __() { }
    __.prototype = o;
    return new __();
}
//# sourceMappingURL=is.spec.js.map
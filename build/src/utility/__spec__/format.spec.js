var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var format_1 = require("../format");
var collection_1 = require("../collection");
var fn_1 = require("../fn");
var formatCases = [
    ['\\{}', '{}'],
    ['{} {} {$}', '123 456 undefined', 123, 456],
    ['{$} {} {$}', '123 456 undefined', 123, 456],
    ['{1} {0}', '456 123', 123, 456],
    ['{@} {} {@} {} {1} {0}', '123 123 123 456 456 123', 123, 456],
    ['{{[0]}} {@{[0]}} {${abc}} {0{[0]}} {1{["abc"]}}', '123 123 456 123 456', [123], { abc: 456 }],
    ["{@{a.b.c}} {@{a[\"b\"].c}} {@{['a'][\"b\"].c}}", '123 123 123', { a: { b: { c: 123 } } }],
    [
        "{$:b} {@:#b} {@:#B} {@:#05B} {$b} {b} {b} {b}",
        '10 0b10 0B10 0B010 10 11111111111111111111111111111110 10 11111111111111111111111111111110',
        2,
        '+2',
        '-2',
        '+2e+0',
        '-2E+0'
    ],
    ["{$:c} {$c} {c} {c}", 'A A A A', 65, '+65', '+6.5e+1', '6.5E+1'],
    [
        "{$:o} {@:#o} {@:#O} {@:#05O} {$o} {o} {o} {o}",
        '10 0o10 0O10 0O010 10 37777777770 10 37777777770',
        8,
        '+8',
        '-8',
        '+8e+0',
        '-8E+0'
    ],
    [
        "{$:x} {@:#x} {@:#X} {@:#05X} {$x} {x} {x} {x}",
        '1f 0x1f 0X1F 0X01F 1f ffffffe1 1f ffffffe1',
        31,
        '+31',
        '-31',
        '+3.1e+1',
        '-3.1E+1'
    ],
    ["{$:u} {$u} {u} {u} {u}", '10 10 4294967286 10 4294967286', 10, '+10', '-10', '+1e+1', '-1E+1'],
    [
        "{$:d} {@:+d} {@: d} {2: d} {@:,+d} {@: ,d} {@:,+010d} {d} {d} {d} {d}",
        '10000 +10000  10000 -10000 +10,000  10,000 +000,010,000 10000 -10000 10000 -10000',
        10000,
        '+10000',
        '-10000',
        '+1e+4',
        '-1E+4'
    ],
    [
        "{$:f} {@:+f} {@: f} {2: f} {@:,+f} {@: ,f} {@:,+012.2f} {f} {f} {f} {f}",
        '10000.00001 +10000.00001  10000.00001 -10000.00001 +10,000.00001  10,000.00001 +00,010,000.00 10000.00001 -10000.00001 10000.00001 -10000.00001',
        10000.00001,
        '+10000.00001',
        '-10000.00001',
        '+1.000000001e+4',
        '-1.000000001e+4'
    ],
    [
        "{$:s} {@:10s} {@:10=-s} {@:5=X.10} {$:5=X.10}",
        'test       test ------test Xtest test-strin',
        'test',
        'test-string'
    ],
    ["===={:.10=\"...\"}====", '====abcdefg...====', 'abcdefghijh']
];
describe('utility/format', function () {
    it('pad', function () {
        expect_js_1["default"](format_1.pad('1', 3, '#')).to.equal('##1');
        expect_js_1["default"](format_1.pad('1', 3, '#', true)).to.equal('1##');
        expect_js_1["default"](format_1.pad('123', 3, '#')).to.equal('123');
        expect_js_1["default"](format_1.pad('123', 3, '#', true)).to.equal('123');
    });
    describe('vformat', function () {
        collection_1.eachArray(formatCases, function (t) {
            it("vformat: " + t[0], function () {
                expect_js_1["default"](format_1.vformat(t[0], t, 0, function (args, i) { return args[i + 2]; })).to.equal(t[1]);
            });
        });
    });
    describe('format', function () {
        collection_1.eachArray(formatCases, function (t) {
            it("format: " + t[0], function () {
                expect_js_1["default"](fn_1.applyNoScope(format_1.format, [t[0]].concat(t.slice(2)))).to.equal(t[1]);
            });
        });
    });
    describe('formatter', function () {
        collection_1.eachArray(formatCases, function (t) {
            it("formatter: " + t[0], function () {
                var f = format_1.formatter(t[0], 0, function (args, i) { return args[i + 2]; });
                expect_js_1["default"](fn_1.applyNoScope(f, t)).to.equal(t[1]);
                expect_js_1["default"](fn_1.applyNoScope(f, t)).to.equal(t[1]);
            });
        });
    });
});
//# sourceMappingURL=format.spec.js.map
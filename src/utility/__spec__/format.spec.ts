import expect from 'expect.js'
import { vformat, format, formatter } from '../format'
import { eachArray } from '../collection'
import { applyNoScope, createFn } from '../fn'
import { escapeString } from '../string'

const formatCases = [
	['\\{}', '{}'],
	['{} {} {$}', '123 456 undefined', 123, 456],
	['{$} {} {$}', '123 456 undefined', 123, 456],
	['{1} {0}', '456 123', 123, 456],
	['{@} {} {@} {} {1} {0}', '123 123 123 456 456 123', 123, 456],
	['{{[0]}} {@{[0]}} {${abc}} {0{[0]}} {1{["abc"]}}', '123 123 456 123 456', [123], { abc: 456 }],
	[`{@{a.b.c}} {@{a["b"].c}} {@{['a']["b"].c}}`, '123 123 123', { a: { b: { c: 123 } } }],
	[
		`{$:b} {@:#b} {@:#B} {@:#05B} {$b} {b} {b} {b}`,
		'10 0b10 0B10 0B010 10 11111111111111111111111111111110 10 11111111111111111111111111111110',
		2,
		'+2',
		'-2',
		'+2e+0',
		'-2E+0'
	],
	[`{$:c} {$c} {c} {c}`, 'A A A A', 65, '+65', '+6.5e+1', '6.5E+1'],
	[
		`{$:o} {@:#o} {@:#05o} {$o} {o} {o} {o}`,
		'10 010 00010 10 37777777770 10 37777777770',
		8,
		'+8',
		'-8',
		'+8e+0',
		'-8E+0'
	],
	[
		`{$:x} {@:#x} {@:#X} {@:#05X} {$x} {x} {x} {x}`,
		'1f 0x1f 0X1F 0X01F 1f ffffffe1 1f ffffffe1',
		31,
		'+31',
		'-31',
		'+3.1e+1',
		'-3.1E+1'
	],
	[`{$:u} {$u} {u} {u} {u}`, '10 10 4294967286 10 4294967286', 10, '+10', '-10', '+1e+1', '-1E+1'],
	[
		`{$:d} {@:+d} {@: d} {2: d} {@:,+d} {@: ,d} {@:,+010d} {d} {d} {d} {d}`,
		'10000 +10000  10000 -10000 +10,000  10,000 +00010,000 10000 -10000 10000 -10000',
		10000,
		'+10000',
		'-10000',
		'+1e+4',
		'-1E+4'
	],
	[
		`{$:f} {@:+f} {@: f} {2: f} {@:,+f} {@: ,f} {@:,+012.2f} {f} {f} {f} {f}`,
		'10000.00001 +10000.00001  10000.00001 -10000.00001 +10,000.00001  10,000.00001 +0010,000.00 10000.00001 -10000.00001 10000.00001 -10000.00001',
		10000.00001,
		'+10000.00001',
		'-10000.00001',
		'+1.000000001e+4',
		'-1.000000001e+4'
	],
	[
		`{$:s} {@:10s} {@:10=-s} {@:5=X.10} {$:5=X.10}`,
		'test       test ------test Xtest test-strin',
		"test",
		"test-string"
	]
]

describe('utility/format', () => {
	describe('vformat', function() {
		eachArray(formatCases, t => {
			it(`vformat: ${t[0]}`, () => {
				expect(vformat(t[0], t, 0, (args, i) => args[i + 2])).to.equal(t[1])
			})
		})
	})
	describe('format', function() {
		eachArray(formatCases, t => {
			it(`format: ${t[0]}`, () => {
				expect(applyNoScope(format, [t[0]].concat(t.slice(2)))).to.equal(t[1])
			})
		})
	})
	describe('formatter', function() {
		eachArray(formatCases, t => {
			it(`formatter: ${t[0]}`, () => {
				const f = formatter(t[0], 0, (args, i) => args[i + 2])
				expect(applyNoScope(f, t)).to.equal(t[1])
				expect(applyNoScope(f, t)).to.equal(t[1])
			})
		})
	})
})

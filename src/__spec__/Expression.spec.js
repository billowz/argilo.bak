import { Expression } from '../Expression'
import { isFn, each, create } from '../helper'
import { get, parsePath } from '../common'

const expCases = [
	{
		name: 'complex path',
		exp: 'a.b.d',
		scope: { a: { b: { d: 123 } } },
		value: 123,
	},
	{
		name: 'complex path',
		exp: 'a["b"].c',
		scope: { a: { b: { c: 234 } } },
		value: 234,
	},
	{
		name: 'string concat',
		exp: 'a+b',
		scope: {
			a: 'hello',
			b: 'world',
		},
		value: 'helloworld',
	},
	{
		name: 'math',
		exp: 'a - b * 2 + 45',
		scope: { a: 100, b: 23 },
		value: 100 - 23 * 2 + 45,
	},
	{
		name: 'boolean logic',
		exp: '(a && b) ? c : d || e',
		scope: {
			a: true,
			b: false,
			c: null,
			d: false,
			e: 'worked',
		},
		value: 'worked',
	},
	{
		name: 'inline string with newline',
		exp: "a + 'h\ne\tl\rlo'",
		scope: { a: 'inline\n ' },
		value: 'inline\n h\ne\tl\rlo',
	},
	{
		name: 'inline string with quotes',
		exp: "a + 'h\"el`lo'",
		scope: { a: 'inline " ' },
		value: 'inline " h"el`lo',
	},
	{
		name: 'inline string with quotes',
		exp: 'a + "h\'el`lo"',
		scope: { a: 'inline " ' },
		value: 'inline " h\'el`lo',
	},
	{
		name: 'multiline expressions',
		exp: "{\n a: '35',\n b: c}",
		scope: { c: 32 },
		value: { a: '35', b: 32 },
	},
	{
		name: 'Object with string values and quotes',
		exp: '[{"a":"he`llo"},{"b":"world"},{"c":55}]',
		scope: {},
		value: [
			{
				a: 'he`llo',
			},
			{
				b: 'world',
			},
			{
				c: 55,
			},
		],
	},
	{
		name: 'dollar signs and underscore',
		exp: "_a + ' ' + $b",
		scope: {
			_a: 'underscore',
			$b: 'dollar',
		},
		value: 'underscore dollar',
	},
	{
		name: 'complex with nested values',
		exp: "todo.title + ' : ' + (todo['done'] ? 'yep' : 'nope')",
		scope: {
			todo: {
				title: 'write tests',
				done: false,
			},
		},
		value: 'write tests : nope',
	},
	{
		name: 'expression with no data variables',
		exp: "'a' + 'b'",
		scope: {},
		value: 'ab',
		paths: [],
	},
	{
		name: 'values with same variable name inside strings',
		exp: '\'"test"\' + test + "\'hi\'" + hi',
		scope: {
			test: 1,
			hi: 2,
		},
		value: '"test"1\'hi\'2',
	},
	{
		name: 'expressions with inline object literals',
		exp: "sortRows({ column: 'name', test: foo, durrr: 123 })",
		scope: {
			sortRows: function(params) {
				return params.column + params.test + params.durrr
			},
			foo: 'bar',
		},
		value: 'namebar123',
	},
	{
		name: 'space between path segments',
		exp: '  a    .   b    .  c + d',
		scope: {
			a: {
				b: {
					c: 12,
				},
			},
			d: 3,
		},
		value: 15,
	},
	{
		name: 'space in bracket identifiers',
		exp: ' a[ " a.b.c " ] + b  [ \' e \' ]',
		scope: {
			a: {
				' a.b.c ': 123,
			},
			b: {
				' e ': 234,
			},
		},
		value: 357,
	},
	{
		name: 'number literal',
		exp: 'a * 1e2 + 1.1',
		scope: {
			a: 3,
		},
		value: 301.1,
	},
	{
		name: 'keyowrd + keyword literal',
		exp: 'true && a["true"]',
		scope: {
			a: {
				true: false,
			},
		},
		value: false,
	},
	{
		name: 'super complex',
		exp: ' $a + b[ "  a.b.c  " ][\'123\'].$e&&c[ " d " ].e + Math.round(e) ',
		scope: {
			$a: 1,
			b: {
				'  a.b.c  ': {
					'123': {
						$e: 2,
					},
				},
			},
			c: {
				' d ': {
					e: 3,
				},
			},
			e: 4.5,
		},
		value: 8,
	},
	{
		name: 'string with escaped quotes',
		exp: "'a\\'b' + c",
		scope: {
			c: "'c",
		},
		value: "a'b'c",
	},
	{
		name: 'dynamic sub path',
		exp: "a['b' + i + 'c']",
		scope: {
			i: 0,
			a: {
				b0c: 123,
			},
		},
		value: 123,
	},
	{
		name: 'Math global, simple path',
		exp: 'Math.PI',
		scope: {},
		value: Math.PI,
	},
	{
		name: 'Math global, exp',
		exp: 'Math.sin(a)',
		scope: {
			a: 1,
		},
		value: Math.sin(1),
	},
	{
		name: 'boolean literal',
		exp: 'true',
		scope: {
			true: false,
		},
		value: true,
	},
	{
		name: 'null literal',
		exp: 'null',
		scope: {},
		value: null,
	},
	{
		name: 'undefined literal',
		exp: 'undefined',
		scope: {
			undefined: 1,
		},
		value: undefined,
	},
	{
		name: 'Date',
		exp: 'Date.now() > new Date(1000000000000) ',
		scope: {},
		value: true,
	},
	{
		name: 'typeof operator',
		exp: 'typeof test === "string"',
		scope: {
			test: '123',
		},
		value: true,
	},
	{
		name: 'isNaN',
		exp: 'isNaN(a)',
		scope: {
			a: 2,
		},
		value: false,
	},
	{
		name: 'parseFloat & parseInt',
		exp: 'parseInt(a, 10) + parseFloat(b)',
		scope: {
			a: 2.33,
			b: '3.45',
		},
		value: 5.45,
	},
	{
		name: 'parseFloat & parseInt',
		exp: 'this.parseInt(a, 10) + parseFloat(b)',
		scope: {
			a: 2.33,
			b: '3.45',
			parseInt(a) {
				return parseInt.apply(null, arguments) + 1
			},
		},
		value: 6.45,
	},
	{
		name: 'special property name',
		exp: 'this.true',
		scope: {
			true: 1,
		},
		value: 1,
	},
	{
		name: 'set value',
		exp: 'a = 1',
		scope: {
			a: 0,
		},
		value: 1,
		expect(scope) {
			expect(scope.a).equal(1)
		},
	},
	{
		name: 'set value (complex path)',
		exp: 'a.b.c = 1',
		scope: {
			a: {
				b: {
					c: 0,
				},
			},
		},
		value: 1,
		expect(scope) {
			expect(scope.a.b.c).equal(1)
		},
	},
	{
		name: 'set value (complex path with array index)',
		exp: 'a.b[0].c = 1',
		scope: {
			a: {
				b: [
					{
						c: 0,
					},
				],
			},
		},
		value: 1,
		expect(scope) {
			expect(scope.a.b[0].c).equal(1)
		},
	},
	{
		name: 'plus and set value',
		exp: 'a += 1',
		scope: {
			a: 0,
		},
		value: 1,
		expect(scope) {
			expect(scope.a).equal(1)
		},
	},
	{
		name: 'subtract and set value',
		exp: 'a -= 1',
		scope: {
			a: 0,
		},
		value: -1,
		expect(scope) {
			expect(scope.a).equal(-1)
		},
	},
	{
		name: 'multiply and set value',
		exp: 'a *= 2',
		scope: {
			a: 1,
		},
		value: 2,
		expect(scope) {
			expect(scope.a).equal(2)
		},
	},
	{
		name: 'divisive and set value',
		exp: 'a /= 2',
		scope: {
			a: 1,
		},
		value: 0.5,
		expect(scope) {
			expect(scope.a).equal(0.5)
		},
	},
	{
		name: 'and and set value',
		exp: 'a &= 0',
		scope: {
			a: 1,
		},
		value: 0,
		expect(scope) {
			expect(scope.a).equal(0)
		},
	},
	{
		name: 'left and set value',
		exp: 'a <<= 1',
		scope: {
			a: 1,
		},
		value: 2,
		expect(scope) {
			expect(scope.a).equal(2)
		},
	},
	{
		name: 'right and set value',
		exp: 'a >>= 1',
		scope: {
			a: 2,
		},
		value: 1,
		expect(scope) {
			expect(scope.a).equal(1)
		},
	},
]

describe('Expression', () => {
	each(expCases, testCase => {
		it(testCase.name ? testCase.name + ': ' + testCase.exp : testCase.exp, () => {
			const scope = create(testCase.scope, {
					$findContext: {
						value(path) {
							path = parsePath(path)
							path.pop()
							return get(this, path)
						},
					},
				}),
				args = [testCase.el],
				value = testCase.value,
				exp = new Expression(testCase.exp, testCase.keywords, testCase.transforms)

			console.log(testCase.exp + ': ' + exp.executor.toString())
			expect(exp.transformValue(scope, args)).to.eql(value)

			if (isFn(testCase.expect)) testCase.expect(scope, testCase)
		})
	})
})

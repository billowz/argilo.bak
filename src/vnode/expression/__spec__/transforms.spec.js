import Expression from '../index'
import { isFn, each, create } from '../../../helper'
import { get, parsePath } from '../../../common'

const transformCases = [
	{
		name: 'plural',
		exp: 'a|plural',
		scope: {
			a: 'test',
		},
		value: 'test',
		transformValue: 'tests',
	},
	{
		name: 'singular',
		exp: 'a|singular',
		scope: {
			a: 'tests',
		},
		value: 'tests',
		transformValue: 'test',
	},
	{
		name: 'format',
		exp: 'a|format "%3$.2f, %2$5d, %$1s", b, c',
		scope: {
			a: 'tests',
			b: 123,
			c: 1231.123,
		},
		value: 'tests',
		transformValue: '1231.12, 00123, tests',
	},
	{
		name: 'json',
		exp: 'json|json',
		scope: {
			json: { a: 1 },
		},
		value: { a: 1 },
		transformValue: '{"a":1}',
	},
	{
		name: 'json with idents',
		exp: 'json | json 2',
		scope: {
			json: {
				a: 1,
			},
		},
		value: { a: 1 },
		transformValue: '{\n  "a": 1\n}',
	},
	{
		name: 'trim',
		exp: 'str|trim',
		scope: {
			str: '   test   ',
		},
		value: '   test   ',
		transformValue: 'test',
		restore: 'test',
	},
	{
		name: 'capitalize',
		exp: 'str|capitalize',
		scope: {
			str: 'test',
		},
		value: 'test',
		transformValue: 'Test',
	},
	{
		name: 'uppercase',
		exp: 'str|uppercase',
		scope: {
			str: 'aaAa',
		},
		value: 'aaAa',
		transformValue: 'AAAA',
	},
	{
		name: 'lowercase',
		exp: 'str|lowercase',
		scope: {
			str: 'AAaA',
		},
		value: 'AAaA',
		transformValue: 'aaaa',
	},
	{
		name: 'unit',
		exp: 'str| unit "item","%s %s"',
		scope: {
			str: 1123,
		},
		value: 1123,
		transformValue: '1123 items',
	},
	{
		name: 'bytes',
		exp: 'v| bytes 2',
		scope: {
			v: 1.5 * (1024 * 1024 * 1024),
		},
		value: 1.5 * (1024 * 1024 * 1024),
		transformValue: '1.5 GB',
		restore: 1.5 * (1024 * 1024 * 1024),
	},
	{
		name: 'unit',
		exp: 'v| unit "apply"',
		scope: {
			v: 2,
		},
		value: 2,
		transformValue: '2 applies',
	},
	{
		name: 'unit with format',
		exp: 'v| unit "apply", "%2$s (%1$d)"',
		scope: {
			v: 2,
		},
		value: 2,
		transformValue: 'applies (2)',
	},
]

describe('Transform Expression', () => {
	each(transformCases, testCase => {
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
				value = 'value' in testCase ? testCase.value : testCase.transformValue,
				transformValue = 'transformValue' in testCase ? testCase.transformValue : testCase.value,
				exp = new Expression(testCase.exp, testCase.keywords, testCase.transforms)

			console.log(testCase.exp + ': ' + exp.executor.toString())
			expect(exp.value(scope, args)).to.eql(value)
			expect(exp.transformValue(scope, args)).to.eql(transformValue)
			expect(exp.transform(value, scope, args)).to.eql(transformValue)

			if ('restore' in testCase) expect(exp.restore(transformValue, scope, args)).to.eql(testCase.restore)

			if (isFn(testCase.expect)) testCase.expect(scope, value, transformValue, testCase)
		})
	})
})

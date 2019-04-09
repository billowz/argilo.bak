import { parsePath, formatPath } from '..'
import { assert } from '../../assert'

function _parsePath(p: string) {
	return parsePath(p).slice()
}

describe('util/path', () => {
	it('formatPath', () => {
		assert.eql(formatPath(['0']), '["0"]')
		assert.eql(formatPath(['a', 'b', 'c']), '["a"]["b"]["c"]')
		assert.eql(formatPath(['a', '0', 'c']), `["a"]["0"]["c"]`)
		assert.eql(formatPath(['a', '/ad2', 'c']), `["a"]["/ad2"]["c"]`)
	})
	it('parsePath', () => {
		assert.eql(_parsePath('a'), ['a'])
		assert.eql(_parsePath('$abc12'), ['$abc12'])
		assert.eql(_parsePath('_a12bc'), ['_a12bc'])
		assert.eql(_parsePath('[0]'), ['0'])
		assert.eql(_parsePath('a.b.c'), ['a', 'b', 'c'])
		assert.eql(_parsePath('a["b"].c'), ['a', 'b', 'c'])
		assert.eql(_parsePath('a[0].c'), ['a', '0', 'c'])
	})
})

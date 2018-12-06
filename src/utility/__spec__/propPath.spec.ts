import expect from 'expect.js'
import { parsePath, formatPath } from '../propPath'

describe('utility/path', () => {
	it('parsePath', () => {
		expect(parsePath('a')).to.eql(['a'])
		expect(parsePath('$abc12')).to.eql(['$abc12'])
		expect(parsePath('_a12bc')).to.eql(['_a12bc'])
		expect(parsePath('[0]')).to.eql(['0'])
		expect(parsePath('a.b.c')).to.eql(['a', 'b', 'c'])
		expect(parsePath('a["b"].c')).to.eql(['a', 'b', 'c'])
		expect(parsePath('a[0].c')).to.eql(['a', '0', 'c'])
	})

	it('formatPath', () => {
		expect(formatPath(['a', 'b', 'c'])).to.eql('["a"]["b"]["c"]')
		expect(formatPath(['a', '0', 'c'])).to.eql(`["a"]["0"]["c"]`)
		expect(formatPath(['a', '/ad2', 'c'])).to.eql(`["a"]["/ad2"]["c"]`)
	})
})

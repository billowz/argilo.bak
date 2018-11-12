import { parsePath, formatPath } from '../path'

describe('path', () => {
	it('parsePath', () => {
		expect(parsePath('a.b.c')).to.eql(['a', 'b', 'c'])
		expect(parsePath('a["b"].c')).to.eql(['a', 'b', 'c'])
		expect(parsePath('a[0].c')).to.eql(['a', '0', 'c'])
	})

	it('formatPath', () => {
		expect(formatPath(['a', 'b', 'c'])).to.eql('a.b.c')
		expect(formatPath(['a', '0', 'c'])).to.eql(`a['0'].c`)
		expect(formatPath(['a', '/ad2', 'c'])).to.eql(`a['/ad2'].c`)
	})
})

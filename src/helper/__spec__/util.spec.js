import { makeMap, makeArray } from '../util'

describe('Util', () => {
	it('makeMap', () => {
		expect(makeMap('')).to.eql({})
		expect(makeMap(' ')).to.eql({ ' ': true })
		expect(makeMap(' , a ')).to.eql({ ' ': true, ' a ': true })
		expect(makeMap('a,b')).to.eql({ a: true, b: true })
		expect(makeMap(['a', 'b'])).to.eql({ a: true, b: true })
		expect(makeMap('a,b', false)).to.eql({ a: false, b: false })

		function fn() {}
		expect(makeMap('a,b', () => fn)).to.eql({ a: fn, b: fn })

		expect(makeMap(['a', 'b'], () => fn)).to.eql({ a: fn, b: fn })

		expect(
			makeMap(
				'a,b',
				function(k, i) {
					return i
				},
				true
			)
		).to.eql({
			a: 0,
			b: 1,
		})

		expect(
			makeMap(
				['a', 'b'],
				function(k, i) {
					return i
				},
				true
			)
		).to.eql({
			a: 0,
			b: 1,
		})
	})

	it('makeArray', () => {
		expect(makeArray('')).to.eql([])
		expect(makeArray(' ')).to.eql([' '])
		expect(makeArray(' , b ')).to.eql([' ', ' b '])
		expect(makeArray('a,b')).to.eql(['a', 'b'])
		expect(makeArray([])).to.eql([])
		expect(makeArray('a,b', (v, i) => i)).to.eql([0, 1])
	})
})

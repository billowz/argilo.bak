import expect from 'expect.js'
import { trim, pad } from '../string'

describe('utility/string', () => {
	it('trim', () => {
		expect(trim('')).to.equal('')
		expect(trim(' ')).to.equal('')
		expect(trim('   ')).to.equal('')
		expect(trim('a  ')).to.equal('a')
		expect(trim('  a')).to.equal('a')
		expect(trim('  a  ')).to.equal('a')
	})

	it('pad', () => {
		expect(pad('1', 3, '#')).to.equal('##1')
		expect(pad('1', 3, '#', true)).to.equal('1##')
		expect(pad('123', 3, '#')).to.equal('123')
		expect(pad('123', 3, '#', true)).to.equal('123')
	})
	it('strval')
	it('thousandSeparate')
	it('plural')
	it('singular')
	it('escapeString')
})

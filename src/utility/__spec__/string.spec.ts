import expect from 'expect.js'
import { trim } from '../string'

describe('utility/string', () => {
	it('trim', () => {
		expect(trim('')).to.equal('')
		expect(trim(' ')).to.equal('')
		expect(trim('   ')).to.equal('')
		expect(trim('a  ')).to.equal('a')
		expect(trim('  a')).to.equal('a')
		expect(trim('  a  ')).to.equal('a')
	})

	it('strval')
	it('thousandSeparate')
	it('plural')
	it('singular')
	it('escapeStr')
})

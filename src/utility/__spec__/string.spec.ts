import expect from 'expect.js'
import { trim, escapeStr } from '../string'

describe('utility/string', () => {
	it('trim', () => {
		expect(trim('')).to.equal('')
		expect(trim(' ')).to.equal('')
		expect(trim('   ')).to.equal('')
		expect(trim('a  ')).to.equal('a')
		expect(trim('  a')).to.equal('a')
		expect(trim('  a  ')).to.equal('a')
	})

	it('escapeStr', () => {
		expect(escapeStr('\n\t\f"\'')).to.equal('\\n\\t\\f\\"\\\'')
	})
})

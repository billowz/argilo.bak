import { trim } from '../string'

describe('String', () => {
	it('trim', () => {
		expect(trim('')).to.equal('')
		expect(trim(' ')).to.equal('')
		expect(trim('   ')).to.equal('')
		expect(trim('a  ')).to.equal('a')
		expect(trim('  a')).to.equal('a')
		expect(trim('  a  ')).to.equal('a')
	})
})

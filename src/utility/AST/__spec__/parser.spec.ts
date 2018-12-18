import { json } from './json'
import pkg from '../../../../package.json'
import { assert } from '../../assert'

describe('utility/AST', function() {
	describe('json', function() {
		it('json', () => {
			assert.eql(json.parse(JSON.stringify(pkg))[0], pkg)
			assert.eql(json.parse(JSON.stringify(pkg, null, '  '))[0], pkg)
			assert.eql(json.parse(JSON.stringify(pkg, null, '\t'))[0], pkg)
		})
	})
})

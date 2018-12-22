import { json } from './json'
import pkg from '../../../../package.json'
import { assert } from '../../assert'
import { html } from './html'

describe('utility/AST', function() {
	describe('json', function() {
		it('json', () => {
			assert.eql(json.parse(JSON.stringify(pkg))[0], pkg)
			assert.eql(json.parse(JSON.stringify(pkg, null, '  '))[0], pkg)
			assert.eql(json.parse(JSON.stringify(pkg, null, '\t'))[0], pkg)
		})
	})

	describe('html', function() {
		it('html', () => {
			const rs = html.parse(`
			<form name="input" action="html_form_action.php" method="get">
			Username: <input type="text" name="user">
			Password:
			<input type="text" name="pwd">
			<input type="submit" value="Submit">
			</form>
`)
			assert.eq(rs, [
				{
					tag: 'form',
					attrs: {
						name: 'input',
						action: 'html_form_action.php',
						method: 'get'
					},
					children: [
						{
							text: 'Username: '
						},
						{
							tag: 'input',
							attrs: {
								type: 'text',
								name: 'user'
							}
						},
						{
							text: 'Password:\n\t\t\t'
						},
						{
							tag: 'input',
							attrs: {
								type: 'text',
								name: 'pwd'
							}
						},
						{
							tag: 'input',
							attrs: {
								value: 'Submit'
							}
						}
					]
				}
			], "\n{0j}\n{1j}")
		})
	})
})

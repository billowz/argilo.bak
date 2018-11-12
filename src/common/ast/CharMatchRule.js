import MatchRule from './MatchRule'
import { inherit } from '../../helper'

/**
 * match one char which in allow list.
 * well match every char when allows is empty
 *
 * @class CharMatchRule
 * @implements MatchRule
 * @param {String}                              name                        rule name
 * @param {(Int|String|Array<String|Int>)}      allows                      which char can be matched.
 *                                                                          well match every char when allows is empty
 * @param {Object}                              option                      rule option
 * @param {Boolean}                             [option.ignoreCase=false]   match with ignore case
 * @param                                       option....                  @see {@link Rule}
 */
export default inherit(
	function CharMatchRule(name, allows, option) {
		option.start = allows
		MatchRule.call(this, name, option)

		const codes = this.start

		let i = codes.length,
			expr = '*'
		this.test = i ? this.test : everyCharTest

		if (i) {
			const chars = []
			while (i--) chars[i] = String.fromCharCode(codes[i])
			expr = `"${chars.join('" | "')}"`
		}
		this.setExpr(expr)
	},
	MatchRule,
	/** @lends CharMatchRule.prototype */
	{
		type: 'Character',
		/**
		 * @override
		 */
		match: function charMatch(stream, resultSet) {
			return this.comsume(stream, String.fromCharCode(stream.nextCode()), 1, resultSet)
		},
	}
)
/**
 * prepare test always return true when still have next char
 *
 * @memberof CharMatchRule.prototype
 * @member test
 * @override
 */
function everyCharTest(stream) {
	return stream.nextCode()
}

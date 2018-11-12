import RegMatchRule from './RegMatchRule'
import { OPTION_START, OPTION_IGNORE_CASE, OPTION_PICK } from './MatchRule'
import { inherit, reEscape } from '../../helper'

/**
 * match string
 *
 * @class StringMatchRule
 * @implements RegMatchRule
 * @param {String}                              name                        rule name
 * @param {String}                              str                         string
 * @param {Object}                              option                      rule option
 * @param {Boolean}                             [option.ignoreCase=false]   match with ignore case
 * @param {Boolean}                             [option.pick=0]             pick match result (0 | false)
 * @param                                       option....                  @see {@link Rule}
 */
export default inherit(
	function StrMatchRule(name, str, option) {
		option[OPTION_PICK] = option[OPTION_PICK] === false ? false : 0
		option[OPTION_START] = str.charCodeAt(0)
		RegMatchRule.call(this, name, new RegExp(reEscape(str), option[OPTION_IGNORE_CASE] ? 'i' : ''), option)
		this.setExpr(str)
	},
	RegMatchRule,
	{
		type: 'String',
	}
)

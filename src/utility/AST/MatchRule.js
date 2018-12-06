import Rule from './Rule'
import { inherit } from '../../helper'
import { eachCharCodes } from './util'

export const OPTION_START = 'start',
	OPTION_IGNORE_CASE = 'ignoreCase',
	OPTION_PICK = 'pick'

/**
 * match rule interface
 *
 * @class MatchRule
 * @implements Rule
 * @param {String}                              name                        match rule name
 * @param {Object}                              option                      match rule option
 * @param {(Int|String|Array<String|Int>)}      [option.start]              start chars
 * @param {Boolean}                             [option.ignoreCase=false]   match with ignore case
 * @param                                       option....                  @see {@link Rule}
 */
export default inherit(
	function MatchRule(name, option) {
		Rule.call(this, name, option)

		const start = [],
			index = []
		eachCharCodes(option[OPTION_START], option[OPTION_IGNORE_CASE], code => {
			if (!index[code]) {
				start.push(code)
				index[code] = code
			}
		})
		this.start = start
		this.index = index
		this.test = start.length ? indexTest : this.test
		this.ignoreCase = option[OPTION_IGNORE_CASE] != false
	},
	Rule,
	/** @lends MatchRule.prototype */
	{
		/**
		 *
		 * @param {Stream}          stream
		 * @param {*}               data
		 * @param {Integer}         len
		 * @param {MatchResultSet}  resultSet
		 */
		comsume(stream, data, len, resultSet) {
			stream.consume(len)
			return this.success(stream, data, resultSet)
		},
		/**
		 * @override
		 */
		getStart() {
			return this.start
		}
	}
)
/**
 * prepare test by index of start codes
 * @memberof MatchRule.prototype
 * @member test
 * @override
 */
function indexTest(stream) {
	return this.index[stream.nextCode()]
}

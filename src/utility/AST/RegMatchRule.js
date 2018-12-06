import MatchRule, { OPTION_IGNORE_CASE } from './MatchRule'
import { inherit, regStickySupport, isInt } from '../../helper'

export const OPTION_PICK = 'pick'

/**
 * match by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 * @class RegMatchRule
 * @implements MatchRule
 *
 * @param {String}                              name                rule name
 * @param {RegExp}                              regexp              regexp
 * @param {Object}                              option              rule option
 * @param {(Int|String|Array<String|Int>)}      [option.start]      start chars
 * @param {Boolean}                             [option.pick=0]     pick match result
 * <table>
 * <tr><td> 0            </td><td> pick match[0] (optimize: test and substring in sticky mode)  </td></tr>
 * <tr><td> less than 0  </td><td> pick match[pick]                                             </td></tr>
 * <tr><td> great than 0 </td><td> pick first matched group                                     </td></tr>
 * <tr><td> true         </td><td> pick match                                                   </td></tr>
 * <tr><td> false        </td><td> no data pick (optimize: just test string in sticky mode)     </td></tr>
 * </table>
 * @param                                       option....          @see {@link Rule}
 *
 */
export default inherit(
	function RegMatchRule(name, regexp, option) {
		let pick = option[OPTION_PICK]

		pick = pick === false || isInt(pick) ? pick : !!pick || 0

		const sticky = regStickySupport && !pick, // use exec when need pick match group data
			pattern = regexp.source,
			ignoreCase = regexp.ignoreCase

		regexp = new RegExp(
			sticky ? pattern : `^(?:${pattern})`,
			(ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : '')
		)

		option[OPTION_IGNORE_CASE] = ignoreCase
		MatchRule.call(this, name, option)

		this.regexp = regexp
		this.pick = pick

		this.match = generateMatch(name || `reg${this.id}`, sticky, pick)

		this.setExpr(regexp.toString())
	},
	MatchRule,
	{
		type: 'RegExp'
	}
)

/**
 * generate match function
 *
 * sticky mode:
 *
 *      var reg = this.regexp,
 *          buff = stream.buff(),
 *          start = stream.offset()
 *      reg.lastIndex = start
 *      if (reg.test(buff))
 *          return this.comsume(stream,
 *                              this.pick === false ? null : buff.substring(start, reg.lastIndex),
 *                              reg.lastIndex - start)
 *      return this.error(stream, this.EXPECT, this.capturable, result);
 *
 * unsticky mode:
 *
 *      var m = this.regexp.exec(stream.buff(true))
 *      if (m) {
 *          var pick = this.pick,
 *              pickData
 *          if (pick < 0) {
 *              pick = -pick
 *              for(var i = 1; i <= pick; i++) {
 *                  if (m[i]) {
 *                      pickData = m[i]
 *                      break
 *                  }
 *              }
 *          }else {
 *              pickData = pick === true ? m : m[pick || 0]
 *          }
 *          return this.comsume(stream, pickData, m[0].length, result)
 *      }
 *      return this.error(stream, this.EXPECT, this.capturable);
 *
 * @memberof RegMatchRule.prototype
 */
function generateMatch(name, sticky, pick) {
	const R = `this.regexp`,
		STREAM = 'stream',
		S_BUFF = `${STREAM}.buff`,
		LIDX = `r.lastIndex`

	name += `_${sticky ? 'test' : 'exec'}_pick_${pick === true ? 'all' : pick < 0 ? 'one_' + -pick : pick || 0}`

	let code = sticky
		? // sticky mode
		  `var r = ${R}, b = ${S_BUFF}(), s = ${STREAM}.offset();
\t${LIDX} = s;
\tif (r.test(b))
\t\t${consumCode(pick === false ? 'null' : `b.substring(s, ${LIDX})`, `${LIDX} - s`)}`
		: // unsticky mode
		  `var m = ${R}.exec(${S_BUFF}(true));
\tif (m)
\t\t${consumCode(pick < 0 ? pickCode(-pick) : `m${pick === true ? '' : `[${pick || 0}]`}`, 'm[0].length')}`

	return new Function(`return function ${name}(${STREAM}, rs){
\t${code}
\treturn this.error(${STREAM}, this.EXPECT, this.capturable);
}`)()

	function consumCode(data, len) {
		return `return this.comsume(${STREAM}, ${data}, ${len}, rs)`
	}

	function pickCode(pick) {
		let arr = []
		for (var i = 1; i <= pick; i++) arr.push(`m[${i}]`)
		return arr.join(' || ')
	}
}

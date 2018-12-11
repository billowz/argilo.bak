/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 20:17:28 GMT+0800 (China Standard Time)
 */

import { MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { regStickySupport } from '../reg'
import { isInt } from '../is'
import { createFn } from '../fn'

/**
 * match by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 * @class RegMatchRule
 * @implements MatchRule
 *
 * @param name		rule name
 * @param regexp	regexp
 * @param start		start chars
 * @param pick		pick match result
 * <table>
 * <tr><td> 0            </td><td> pick match[0] (optimize: test and substring in sticky mode)  </td></tr>
 * <tr><td> less than 0  </td><td> pick match[pick]                                             </td></tr>
 * <tr><td> great than 0 </td><td> pick first matched group                                     </td></tr>
 * <tr><td> true         </td><td> pick match                                                   </td></tr>
 * <tr><td> false        </td><td> no data pick (optimize: just test string in sticky mode)     </td></tr>
 * </table>
 */
export class RegMatchRule extends MatchRule {
	readonly regexp: RegExp
	readonly pick: boolean | number
	private picker: (m: string[]) => any
	constructor(
		name: string,
		regexp: RegExp,
		pick: boolean | number,
		start: number | string | any[],
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		pick = pick === false || isInt(pick) ? pick : !!pick || 0

		const sticky = regStickySupport && !pick, // use exec when need pick match group data
			pattern = regexp.source,
			ignoreCase = regexp.ignoreCase

		// always wrapping in a none capturing group preceded by '^' to make sure
		// matching can only work on start of input. duplicate/redundant start of
		// input markers have no meaning (/^^^^A/ === /^A/)

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
		// When the y flag is used with a pattern, ^ always matches only at the
		// beginning of the input, or (if multiline is true) at the beginning of a
		// line.
		regexp = new RegExp(
			sticky ? pattern : `^(?:${pattern})`,
			(ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : '')
		)

		super(name, start, regexp.ignoreCase, capturable, onMatch, onErr)

		this.type = 'RegExp'
		this.regexp = regexp
		this.pick = pick
		this.match = sticky ? this.stickyMatch : this.execMatch
		!sticky && (this.picker = pick === true ? pickAll : pick < 0 ? anyPicker(-pick) : idxPicker(pick || 0))

		this.setExpr(pattern)
	}
	match(context: MatchContext) {
		return this.comsume(context.nextChar(), 1, context)
	}
	stickyMatch(context: MatchContext): MatchError {
		const reg = this.regexp,
			buff = context.getBuff(),
			start = context.getOffset()
		reg.lastIndex = start
		if (reg.test(buff))
			return this.comsume(
				this.pick === false ? null : buff.substring(start, reg.lastIndex),
				reg.lastIndex - start,
				context
			)
		return this.error(this.EXPECT, context, this.capturable)
	}
	execMatch(context: MatchContext): MatchError {
		const m = this.regexp.exec(context.getBuff(true))
		if (m) {
			return this.comsume(this.picker(m), m[0].length, context)
		}
		return this.error(this.EXPECT, context, this.capturable)
	}
}

function pickAll(m: string[]) {
	return m
}

const idxPickers: ((m: string[]) => any)[] = []
function idxPicker(pick: number): (m: string[]) => any {
	return idxPickers[pick] || (idxPickers[pick] = m => m[pick])
}

const anyPickers: ((m: string[]) => any)[] = []
function anyPicker(size: number): (m: string[]) => any {
	let picker = anyPickers[size]
	if (!picker) {
		const arr = new Array(size)
		var i = size
		while (i--) arr[i] = `m[${i + 1}]`
		anyPickers[size] = picker = createFn(`return ${arr.join(' || ')}`, ['m'])
	}
	return picker
}

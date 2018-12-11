/**
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 17:07:13 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { eachCharCodes } from './util'

export class MatchRule extends Rule {
	protected readonly start: number[]
	protected readonly index: number[]
	protected readonly ignoreCase: boolean
	constructor(
		name: string,
		start: number | string | any[],
		ignoreCase: boolean,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, capturable, onMatch, onErr)

		this.ignoreCase = ignoreCase

		const __start: number[] = [],
			index: number[] = []
		eachCharCodes(start, ignoreCase, code => {
			if (!index[code]) {
				__start.push(code)
				index[code] = code
			}
		})
		this.start = __start
		this.index = index
		__start.length && (this.test = indexTest)
	}
	comsume(data: string, len: number, context: MatchContext): MatchError {
		context.advance(len)
		return this.matched(data, len, context)
	}
	getStart(): number[] {
		return this.start
	}
}

/**
 * prepare test by index of start codes
 */
function indexTest(context: MatchContext): boolean {
	return this.index[context.nextCode()]
}

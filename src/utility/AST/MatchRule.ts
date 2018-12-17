/**
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Mon Dec 17 2018 14:33:00 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'

/**
 * Match Rule Interface
 */
export class MatchRule extends Rule {
	protected readonly index: number[]
	protected readonly ignoreCase: boolean
	/**
	 * @param name 			match name
	 * @param start 		start char codes, prepare test by start char codes before match
	 * @param ignoreCase	ignore case for the start char codes
	 * @param capturable	error is capturable
	 * @param onMatch		match callback
	 * @param onErr			error callback
	 */
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
		this.setStartCodes(start, ignoreCase)
	}

	/**
	 * consume matched result
	 * @param data 		matched result
	 * @param len 		matched chars
	 * @param context 	match context
	 */
	comsume(data: string | string[], len: number, context: MatchContext): MatchError {
		context.advance(len)
		return this.matched(data, len, context)
	}
}

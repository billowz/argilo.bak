/**
 * @module util/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:11:19 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, RuleOptions } from './Rule'
import { MatchContext } from './MatchContext'

/**
 * Match Rule Interface
 */
export class MatchRule extends Rule {
	/**
	 * @param name 			match name
	 * @param start 		start char codes, prepare test by start char codes before match
	 * @param ignoreCase	ignore case for the start char codes
	 * @param options		Rule Options
	 */
	constructor(name: string, start: number | string | any[], ignoreCase: boolean, options: RuleOptions) {
		super(name, options)
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

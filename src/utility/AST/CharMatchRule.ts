/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Mon Dec 17 2018 14:33:10 GMT+0800 (China Standard Time)
 */

import { onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { char } from '../string'

/**
 * match a character in the allowed list
 * > well match any character if the allowed list is empty
 *
 * > must call test() before match
 */
export class CharMatchRule extends MatchRule {
	type: string = 'Character'
	/**
	 * @param name 			match name
	 * @param allows 		allowed character codes for match
	 * 						well match any character if the allowed list is empty
	 * @param ignoreCase	ignore case for the allowed character codes
	 * @param capturable	error is capturable
	 * @param onMatch		match callback
	 * @param onErr			error callback
	 */
	constructor(
		name: string,
		allows: number | string | any[],
		ignoreCase: boolean,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, allows, ignoreCase, capturable, onMatch, onErr)
		const codes = this.startCodes

		let i = codes.length,
			expr = '*'
		if (i) {
			const chars = []
			while (i--) chars[i] = char(codes[i])
			expr = `"${chars.join('" | "')}"`
		}
		this.setExpr(expr)
	}
	match(context: MatchContext) {
		return this.comsume(context.nextChar(), 1, context)
	}
}

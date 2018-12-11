/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 20:16:34 GMT+0800 (China Standard Time)
 */

import { onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { char } from '../string'

/**
 * match one char which in allow list.
 * well match every char when allows is empty
 *
 * @param name                        rule name
 * @param allows                      which char can be matched.
 *                                    well match every char when allows is empty
 */
export class CharMatchRule extends MatchRule {
	constructor(
		name: string,
		allows: number | string | any[],
		ignoreCase: boolean,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, allows, ignoreCase, capturable, onMatch, onErr)
		this.type = 'Character'
		const codes = this.start

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

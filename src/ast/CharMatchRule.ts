/**
 *
 * @module util/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:57:09 GMT+0800 (China Standard Time)
 */

import { RuleOptions } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { char, mixin } from '../util'

/**
 * match a character in the allowed list
 * > well match any character if the allowed list is empty
 *
 * > must call test() before match
 */
@mixin({ type: 'Character' })
export class CharMatchRule extends MatchRule {
	/**
	 * @param name 			match name
	 * @param allows 		allowed character codes for match
	 * 						well match any character if the allowed list is empty
	 * @param ignoreCase	ignore case for the allowed character codes
	 * @param options		Rule Options
	 */
	constructor(name: string, allows: number | string | any[], ignoreCase: boolean, options: RuleOptions) {
		super(name, allows, ignoreCase, options)

		// generate expression for debug
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

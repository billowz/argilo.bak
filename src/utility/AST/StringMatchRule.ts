/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:10:52 GMT+0800 (China Standard Time)
 */

import { RuleOptions } from './Rule'
import { RegMatchRule } from './RegMatchRule'
import { reEscape } from '../reg'
import { mixin } from '../mixin'
import { charCode } from '../string'

@mixin({ type: 'String' })
export class StringMatchRule extends RegMatchRule {
	/**
	 * @param name 			match name
	 * @param str 			match string
	 * @param ignoreCase	ignore case
	 * @param options		Rule Options
	 */
	constructor(name: string, str: string, ignoreCase: boolean, options: RuleOptions) {
		super(name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, charCode(str), options)
		this.setExpr(str)
	}
}

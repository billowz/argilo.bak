/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 18:14:27 GMT+0800 (China Standard Time)
 */

import { onMatchCallback, onErrorCallback } from './Rule'
import { RegMatchRule } from './RegMatchRule'
import { reEscape } from '../reg'

export class StringMatchRule extends RegMatchRule {
	type: string = 'String'
	constructor(
		name: string,
		str: string,
		ignoreCase: boolean,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), capturable, onMatch, onErr)
		this.setExpr(str)
	}
}

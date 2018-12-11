/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:58:37 GMT+0800 (China Standard Time)
 */

import { onMatchCallback, onErrorCallback } from './Rule'
import { RegMatchRule } from './RegMatchRule'
import { reEscape } from '../reg'

export class StrMatchRule extends RegMatchRule {
	constructor(
		name: string,
		str: string,
		ignoreCase: boolean,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), capturable, onMatch, onErr)
		this.type = 'String'
		this.setExpr(str)
	}
}

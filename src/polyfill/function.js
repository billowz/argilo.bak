/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:35:27
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:35:27
 */
import { apply } from '../helper/function'
import { PROTOTYPE } from '../helper/constants'

const funcProto = Function[PROTOTYPE]
if (!funcProto.bind) {
	funcProto.bind = function bind(scope) {
		const fn = this,
			len = arguments.length - 1
		if (len > 0) {
			var args = new Array(len),
				i = 0
			for (; i < len; i++) args[i] = arguments[i + 1]

			return function() {
				let l = arguments.length,
					i = 0

				args.length = len + l
				for (; i < l; i++) args[len + i] = arguments[i]
				let rs = apply(fn, scope, args)
				l && (args.length = len)
				return rs
			}
		}
		return function() {
			return apply(fn, scope, arguments)
		}
	}
}

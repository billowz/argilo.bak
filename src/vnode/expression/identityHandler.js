/**
 * VNode Expression Identity Handler
 * @module vnode/expression
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:31:05 GMT+0800 (China Standard Time)
 */
import { IDENTITY_OPT_GET, IDENTITY_OPT_CALL } from '../../Expression'
import { formatPath } from '../../common'

export const VNodeKeyword = '$node'
export function identityHandler(prefix, path, opt) {
	switch (path[0]) {
		case VNodeKeyword:
			return undefined
		case 'this':
			path.shift()
			break
	}

	let identity = formatPath(path),
		expr = opt === IDENTITY_OPT_GET ? 'this.$scope.' + identity : 'this.getScope("' + path[0] + '").' + identity

	if (opt === IDENTITY_OPT_CALL || path[0].charAt(0) === '$') identity = undefined
	if (prefix === '#') {
		identity = undefined
		prefix = ''
	}
	return [prefix + expr, identity]
}

/*
 * VNode Expression Identity Handler
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 17:58:05
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-04 16:15:24
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

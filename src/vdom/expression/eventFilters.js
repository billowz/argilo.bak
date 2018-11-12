/*
 * Dom Event Filters
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 18:15:02
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-05 15:30:40
 */
import { assert } from 'devlevel'
import { eventFilters } from './EventExpression'
import { create, makeMap, applyNoScope, isStr, isArray, isInt } from '../../helper'
import { STOP_PROPAGATION } from '../util/util'

export const keyCodes = {
	esc: 27,
	tab: 9,
	enter: 13,
	space: 32,
	delete: [8, 46],
	up: 38,
	left: 37,
	right: 39,
	down: 40,
}

eventFilters.key = function(e, param) {
	const which = e.which,
		codes = param.get(),
		l = codes.length

	if (!l) return true

	for (var i = 0, code, key, j, m; i < l; i++) {
		code = codes[i]
		if (isStr(code)) {
			key = code
			code = +code
			if (isNaN(code)) {
				// key code
				code = keyCodes[key]
				assert(isInt(code) || isArray(code), `Invalid Key Code[${key}]`)
				if (isArray(code)) {
					// multi code
					for (j = 0, m = code.length; j < m; j++) if (which === code[j]) return true
					continue
				}
			}
		}
		if (which === code) return true
	}
	return false
}

eventFilters.stop = function(e) {
	e[STOP_PROPAGATION]()
}

eventFilters.prevent = function(e) {
	e.preventDefault()
}

eventFilters.self = function(e) {
	return e.target === e.currentTarget
}

/**
 * @module utility/dkeys
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Mar 11 2019 17:22:13 GMT+0800 (China Standard Time)
 * @modified Mon Mar 11 2019 19:52:00 GMT+0800 (China Standard Time)
 */

import { create } from './create'

const keyMap = create(null),
	keyArray = []

export function isDefaultKey(key: string) {
	return keyMap[key] || false
}

export function addDefaultKeys(...keys: string[]): void
export function addDefaultKeys() {
	const args = arguments,
		l = args.length
	for (var i = 0; i < l; i++) {
		addDefaultKey(args[i] + '')
	}
}

export function addDefaultKey(key: string) {
	if (!keyMap[key]) {
		keyMap[key] = true
		keyArray.push(key)
	}
	return key
}

export function getDefaultKeys() {
	return keyArray
}

addDefaultKey('__proto__')

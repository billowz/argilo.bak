/**
 * @module utility/dkeys
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Mar 11 2019 17:22:13 GMT+0800 (China Standard Time)
 * @modified Thu Mar 14 2019 19:01:40 GMT+0800 (China Standard Time)
 */
import { NULL_CONSTRUCTOR } from './consts'

export const defaultKeyMap = new NULL_CONSTRUCTOR()

export const defaultKeys = []

export function isDefaultKey(key: string) {
	return defaultKeyMap[key] || false
}

export function addDefaultKey(key: string) {
	if (!defaultKeyMap[key]) {
		defaultKeyMap[key] = true
		defaultKeys.push(key)
	}
	return key
}

export function addDefaultKeys(...keys: string[]): void

export function addDefaultKeys() {
	const args = arguments,
		l = args.length
	for (var i = 0; i < l; i++) {
		addDefaultKey(args[i] + '')
	}
}

export function getDefaultKeys() {
	return defaultKeys
}

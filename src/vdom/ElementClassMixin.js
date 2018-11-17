/**
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:28:05 GMT+0800 (China Standard Time)
 */
import { DIV, CLASS_NAME } from './util/util'
import { create, trim, isArray, isStr, isBool } from '../helper'

const CLASS_LIST = 'classList'

const wsReg = /\s+/g

const addClass = DIV[CLASS_LIST]
		? mkClasslistUpdator('add')
		: function(el, className) {
				className = parseClassNameArray(className)
				if (className.length)
					el[CLASS_NAME] = trim(clearClassName(el[CLASS_NAME], className) + ' ' + className.join(' '))
				return this
		  },
	removeClass = DIV[CLASS_LIST]
		? mkClasslistUpdator('remove')
		: function(el, className) {
				className = parseClassNameArray(className)
				if (className.length) el[CLASS_NAME] = trim(clearClassName(el[CLASS_NAME], className))
				return this
		  }
export default {
	className(className) {
		const el = this.el
		if (arguments.length) {
			el[CLASS_NAME] = parseClassName(className)
			return this
		}
		return trim(el[CLASS_NAME]).split(wsReg)
	},
	addClass,
	removeClass,
	margeClass(obj) {
		const el = this.el,
			adds = [],
			clears = []
		let name, val
		for (name in obj) {
			val = obj[name]
			switch (val) {
				case true:
					adds.push(name)
				case false:
					clears.push(name)
			}
		}
		el[CLASS_NAME] = trim(clearClassName(el[CLASS_NAME], clears) + ' ' + adds.join(' '))
		return this
	}
}

function mkClasslistUpdator(method) {
	return function(className) {
		className = parseClassNameArray(className)

		const classList = this.el[CLASS_LIST]
		let i = className.length
		while (i--) classList[method](className[i])
		return this
	}
}

const clearRegCache = create(null)

function clearClassName(className, removes) {
	removes = removes.join('|')
	const reg = clearRegCache[removes] || (clearRegCache[removes] = new RegExp('(\\s+|^)(' + removes + ')', 'g'))
	return className.replace(reg, '')
}

function parseClassName(className) {
	if (isStr(className)) return trim(className)
	return parseClassNameArrayByObj(className).join(' ')
}

function parseClassNameArray(className) {
	if (isStr(className)) return trim(className).split(wsReg)
	return parseClassNameArrayByObj(className)
}

function parseClassNameArrayByObj(className) {
	if (isArray(className)) return className

	const names = []
	let key,
		i = 0
	for (key in className) {
		if (className[key] === true) names[i++] = key
	}
	return names
}

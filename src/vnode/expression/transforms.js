/*
 * Transforms
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 17:57:39
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-20 18:30:39
 */
import { makeMap, applyNoScope, isStr, trim } from '../../helper'
import { format, plural, singular, thousandSeparate } from '../../common'
import { transforms } from './TransformExpression'

transforms.json = {
	transform(value, param) {
		if (isStr(value)) return `"${value}"`
		const indent = +param.get(0)
		return JSON.stringify(value, param.get(1), isNaN(indent) ? 0 : indent)
	},
	restore(value) {
		return value && isStr(value) ? JSON.parse(value) : value
	},
}

transforms.trim = {
	transform(value) {
		return isStr(value) ? trim(value) : value
	},
	restore(value) {
		return isStr(value) ? trim(value) : value
	},
}

transforms.capitalize = function(value) {
	return isStr(value) ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

transforms.uppercase = function(value) {
	return isStr(value) ? value.toUpperCase() : value
}

transforms.lowercase = function(value) {
	return isStr(value) ? value.toLowerCase() : value
}

transforms.plural = function(value) {
	return isStr(value) ? plural(value) : value
}

transforms.singular = function(value) {
	return isStr(value) ? singular(value) : value
}

transforms.unit = function(value, param) {
	let unit = param.get(0),
		fmt = param.get(1)
	if (value > 1) unit = plural(unit)
	return fmt ? format(fmt, value, unit) : value + ' ' + unit
}

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
	unitRestoreReg = /(KB|B|MB|GB|TB|PB)$/,
	unitMap = makeMap(units, (unit, i) => 1 << (i * 10))
transforms.bytes = {
	transform(value, param) {
		const v = +value
		if (isNaN(v)) return value

		const digit = param.get(0, 2),
			precision = Math.pow(10, digit),
			i = Math.floor(Math.log(v) / Math.log(1024))
		return Math.round((v * precision) / Math.pow(1024, i)) / precision + ' ' + units[i]
	},
	restore(value) {
		if (!isStr(value)) return value
		let unit,
			v = value.replace(unitRestoreReg, function(match) {
				unit = match
				return ''
			})
		if (!unit) return value
		v = +v
		if (isNaN(v)) return value
		return Math.round(v * unitMap[unit])
	},
}

transforms.format = function(value, param) {
	const args = param.get()
	args.splice(1, 0, value)
	return applyNoScope(format, args)
}

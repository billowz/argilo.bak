/*
 * Dom Value opeartions
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 17:54:59
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-01 11:43:09
 */
import { assert } from 'devlevel'
import createHook from './util/hook'
import { SELECTED } from './util/util'
import { create, applyNoScope, strval, isNil, isArray, isObj, makeMap } from '../helper'

const GET = 'get',
	SET = 'set'

export default {
	value(value) {
		const el = this.el
		let type = el.tagName
		if (type === 'INPUT') type = el.type

		if (arguments.length) {
			memberHook(type, SET)[SET](el, value, type)
			return this
		}
		return memberHook(type, GET)[GET](el, type)
	},
}

export function addDomValueHook() {
	return applyNoScope(addHook, arguments)
}

const EMPTY_MAP = create(null),
	SELECTED_INDEX = 'selectedIndex',
	SELECT_ONE = 'select-one',
	OPTIONS = 'options'

const { memberHook, addHook } = createHook(
	{
		get(el) {
			return el.value || ''
		},
		set(el, value) {
			el.value = strval(value)
		},
	},
	{
		option: {
			get(el) {
				return getOptionValue(el)
			},
		},
		select: {
			get(el) {
				const signle = el.type == SELECT_ONE,
					index = el[SELECTED_INDEX]

				if (index < 0) return signle ? undefined : []

				const options = el[OPTIONS],
					l = options.length

				let option,
					i = 0

				if (!signle) {
					const values = []
					for (; i < l; i++) {
						option = options[i]
						if (option[SELECTED] || i === index) values.push(getOptionValue(option))
					}
					return values
				}
				for (; i < l; i++) {
					option = options[i]
					if (option[SELECTED] || i === index) return getOptionValue(option)
				}
			},
			set(el, value) {
				const signle = el.type == SELECT_ONE,
					options = el[OPTIONS],
					l = options.length

				let option,
					vl,
					val,
					i = 0

				if (signle) {
					for (; i < l; i++) {
						option = options[i]
						if (getOptionValue(option) === value) {
							option[SELECTED] = true
							break
						}
					}
				} else {
					el[SELECTED_INDEX] = -1
					let map
					if (isNil(value)) {
						map = EMPTY_MAP
					} else if (isArray(value)) {
						map = makeMap(value)
					} else if (isObj(value)) {
						map = value
					} else {
						map = create(null)
						map[value] = true
					}
					for (; i < l; i++) {
						option = options[i]
						if (map[getOptionValue(option)] === true) option[SELECTED] = true
					}
				}
			},
		},
	}
)

function getOptionValue(el) {
	const val = el.attributes.value
	return !val || val.specified ? el.value : el.text
}

import { global } from '../../helper'
suite('String Lookups', function() {
	benchmark('lookup_switch', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			lookup_switch(TESTS[i])
		}
	})
	benchmark('lookup_switch_len', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			lookup_switch_len(TESTS[i])
		}
	})
	benchmark('lookup_object_prop', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			KW_OBJECT[TESTS[i]]
		}
	})

	benchmark('lookup_object', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			lookup_object(TESTS[i])
		}
	})

	if (global.Map)
		benchmark('lookup_map', function() {
			for (var i = 0, l = TESTS.length; i < l; i++) {
				lookup_map(TESTS[i])
			}
		})

	benchmark('lookup_switch_len_eval', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			lookup_switch_len_eval(TESTS[i])
		}
	})

	benchmark('lookup_switch_eval', function() {
		for (var i = 0, l = TESTS.length; i < l; i++) {
			lookup_switch_eval(TESTS[i])
		}
	})
})

function lookup_switch(kw) {
	switch (kw) {
		case 'await':
			return 1
		case 'break':
			return 2
		case 'case':
			return 3
		case 'catch':
			return 4
		case 'class':
			return 5
		case 'const':
			return 6
		case 'continue':
			return 7
		case 'debugger':
			return 8
		case 'default':
			return 9
		case 'delete':
			return 10
		case 'do':
			return 11
		case 'else':
			return 12
		case 'export':
			return 13
		case 'extends':
			return 14
		case 'finally':
			return 15
		case 'for':
			return 16
		case 'function':
			return 17
		case 'if':
			return 18
		case 'import':
			return 19
		case 'in':
			return 20
		case 'instanceof':
			return 21
		case 'new':
			return 22
		case 'return':
			return 23
		case 'super':
			return 24
		case 'switch':
			return 25
		case 'this':
			return 26
		case 'throw':
			return 27
		case 'try':
			return 28
		case 'typeof':
			return 29
		case 'var':
			return 30
		case 'void':
			return 31
		case 'while':
			return 32
		case 'with':
			return 33
		case 'yield':
			return 34
		default:
			return 0
	}
}

var lookup_switch_fn = eval('(' + lookup_switch + ')')

function lookup_switch_eval(kw) {
	lookup_switch_fn(kw)
}

function lookup_switch_len(kw) {
	switch (kw.length) {
		case 2:
			switch (kw) {
				case 'do':
					return 11
				case 'if':
					return 18
				case 'in':
					return 20
				default:
					return 0
			}

		case 3:
			switch (kw) {
				case 'for':
					return 16
				case 'new':
					return 22
				case 'try':
					return 28
				case 'var':
					return 30
				default:
					return 0
			}

		case 4:
			switch (kw) {
				case 'case':
					return 3
				case 'else':
					return 12
				case 'this':
					return 26
				case 'void':
					return 31
				case 'with':
					return 33
				default:
					return 0
			}

		case 5:
			switch (kw) {
				case 'await':
					return 1
				case 'break':
					return 2
				case 'catch':
					return 4
				case 'class':
					return 5
				case 'const':
					return 6
				case 'super':
					return 24
				case 'throw':
					return 27
				case 'while':
					return 32
				case 'yield':
					return 34
				default:
					return 0
			}

		case 6:
			switch (kw) {
				case 'delete':
					return 10
				case 'export':
					return 13
				case 'import':
					return 19
				case 'return':
					return 23
				case 'switch':
					return 25
				case 'typeof':
					return 29
				default:
					return 0
			}

		case 7:
			switch (kw) {
				case 'default':
					return 9
				case 'extends':
					return 14
				case 'finally':
					return 15
				default:
					return 0
			}

		case 8:
			switch (kw) {
				case 'continue':
					return 7
				case 'debugger':
					return 8
				case 'function':
					return 17
				default:
					return 0
			}

		case 10:
			switch (kw) {
				case 'instanceof':
					return 21
				default:
					return 0
			}

		default:
			return 0
	}
}

var lookup_switch_len_fn = eval('(' + lookup_switch + ')')

function lookup_switch_len_eval(kw) {
	lookup_switch_len_fn(kw)
}

const KW_OBJECT = {
	await: 1,
	break: 2,
	case: 3,
	catch: 4,
	class: 5,
	const: 6,
	continue: 7,
	debugger: 8,
	default: 9,
	delete: 10,
	do: 11,
	else: 12,
	export: 13,
	extends: 14,
	finally: 15,
	for: 16,
	function: 17,
	if: 18,
	import: 19,
	in: 20,
	instanceof: 21,
	new: 22,
	return: 23,
	super: 24,
	switch: 25,
	this: 26,
	throw: 27,
	try: 28,
	typeof: 29,
	var: 30,
	void: 31,
	while: 32,
	with: 33,
	yield: 34
}

function lookup_object(kw) {
	const result = KW_OBJECT[kw]
	return result === undefined ? 0 : result
}
if (global.Map) {
	const KW_MAP = new Map([
		['await', 1],
		['break', 2],
		['case', 3],
		['catch', 4],
		['class', 5],
		['const', 6],
		['continue', 7],
		['debugger', 8],
		['default', 9],
		['delete', 10],
		['do', 11],
		['else', 12],
		['export', 13],
		['extends', 14],
		['finally', 15],
		['for', 16],
		['function', 17],
		['if', 18],
		['import', 19],
		['in', 20],
		['instanceof', 21],
		['new', 22],
		['return', 23],
		['super', 24],
		['switch', 25],
		['this', 26],
		['throw', 27],
		['try', 28],
		['typeof', 29],
		['var', 30],
		['void', 31],
		['while', 32],
		['with', 33],
		['yield', 34]
	])

	function lookup_map(kw) {
		const result = KW_MAP.get(kw)
		return result === undefined ? 0 : result
	}
}

const TESTS = [
	'await',
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'export',
	'extends',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'new',
	'return',
	'super',
	'switch',
	'this',
	'throw',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'with',
	'yield',
	'a',
	'bc',
	'def',
	'ghij',
	'klmno',
	'pqrstu',
	'vwxyz01',
	'23456789',
	'abcdefghi',
	'jklmnopqrs',
	'012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
]

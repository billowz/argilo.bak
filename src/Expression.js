import { create, createFn, makeMap, apply, trim, STOP, inherit } from './helper'

export const keywords = makeMap(
	'argilo,Math,Date,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,parseInt,parseFloat,' +
		(window ? 'window,document,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent' : 'global')
)

const wsReg = /\s/g,
	newlineReg = /\n/g,
	escapeReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
	restoreReg = /"(\d+)"/g,
	identityReg = /[^\w$\.][A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/g,
	propReg = /^[A-Za-z_$][\w$]*/,
	simplePathReg = /^[A-Za-z_$#@][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,
	splitReg = /\s*\|\s*(?:\|\s*)*/,
	transformParamReg = /\s*,\s*|\s+/g

// escaped code
// save escaped string
const escaped = []

function escape(code) {
	return code.replace(escapeReg, escapeHandler)
}

function restore(code) {
	return code.replace(restoreReg, restoreHandler)
}

function escapeHandler(match) {
	let i = escaped.length
	escaped[i] = match
	return `"${i}"`
}

const escapeStrReg = /\n|\t|\r/g

function escapeStrHandler(m) {
	switch (m) {
		case '\n':
			return '\\n'
		case '\t':
			return '\\t'
		case '\r':
			return '\\r'
	}
}

function restoreHandler(match, i) {
	const v = escaped[i]
	switch (v.charAt(0)) {
		case '"':
		case "'":
		case '`':
			return v.replace(escapeStrReg, escapeStrHandler)
	}
	return v
}

// identity opeartion type
export const IDENTITY_OPT_GET = 1,
	IDENTITY_OPT_SET = 2,
	IDENTITY_OPT_CALL = 3

// parsed identities
let identities = create(null),
	identitySize = 0

// identity process callback: function(prefix, identity, opt[IDENTITY_OPT_GET | IDENTITY_OPT_SET | IDENTITY_OPT_CALL])
let userIdentityHandler, userKeyWords

function isKeyword(attr) {
	return keywords[attr] || (userKeyWords && userKeyWords[attr])
}

function identityHandler(match, i, str) {
	const prefix = match.charAt(0),
		identity = match.slice(1),
		attr = identity.match(propReg)[0]

	if (isKeyword(attr)) return match

	const optIdx = i + match.length,
		optChar = str.charAt(optIdx)

	let opt = IDENTITY_OPT_GET
	switch (optChar) {
		case '(':
			opt = IDENTITY_OPT_CALL
			break
		case '=':
			if (str.charAt(optIdx + 1) !== '=') opt = IDENTITY_OPT_SET
			break
		case '/':
		case '*':
		case '+':
		case '-':
		case '%':
		case '&':
		case '|':
		case '~':
		case '^':
			if (str.charAt(optIdx + 1) === '=') opt = IDENTITY_OPT_SET
			break
		case '>':
		case '<':
			if (str.charAt(optIdx + 1) === optChar && str.charAt(optIdx + 2) === '=') opt = IDENTITY_OPT_SET
			break
	}

	const rs = userIdentityHandler(prefix, identity, opt)
	if (rs) {
		if (rs[1]) {
			if (!identities[rs[1]]) {
				identitySize++
				identities[rs[1]] = true
			}
		}
		return rs[0]
	}
	return match
}

function makeExecutor(code, params) {
	const body = 'return' + restore((' ' + code.replace(wsReg, '')).replace(identityReg, identityHandler))
	try {
		return createFn(body, params)
	} catch (e) {
		console.error(code, body)
		throw e
	}
}

function cleanIdentities() {
	if (!identitySize) return []

	// get identities
	const idents = new Array(identitySize)
	let ident,
		i = 0
	for (ident in identities) idents[i++] = ident

	// reset identities
	identities = create(null)
	identitySize = 0
	return idents
}

function isSimpleExpr(code) {
	if (simplePathReg.test(code)) {
		const match = code.match(propReg)
		return match ? !isKeyword(match[0]) : false
	}
	return false
}

const filterSplitReg = /\s*\|\s*(?:\|\s*)*/,
	filterParamReg = /\s*,\s*|\s+/g

/**
 * - identity processor Prototype:
 *
 * [word: String, identity: String>] function(prefix: String, identity: String, opt: IDENTITY_OPT_GET | IDENTITY_OPT_SET | IDENTITY_OPT_CALL)
 *
 * - transforms format:
 *
 * {
 *      [name]: {
 *          transform(args){
 *              ...
 *          },
 *          restore(args){
 *          }
 *      }
 * }
 * @param {String} code                 expression code
 * @param {String[]} paramNames         parameter names
 * @param {Function} identityHandler    identity processor
 * @param {Function} parseFilter        filter processor
 * @param {Object} keywords             keywords <key, true>
 *
 */
export function Expression(code, paramNames, identityHandler, parseFilter, keywords) {
	userIdentityHandler = identityHandler
	userKeyWords = keywords

	this.expr = code

	const codeSplit = escape(code).split(filterSplitReg),
		len = codeSplit.length

	// parse executor
	this.executor = makeExecutor(codeSplit[0], paramNames)

	const filters = (this.filters = new Array(len - 1))

	// parse filters
	for (var i = 1, j, l, name, args; i < len; i++) {
		args = trim(codeSplit[i]).split(filterParamReg)
		name = restore(args.shift())
		for (j = 0, l = args.length; j < l; j++) args[j] = makeExecutor(args[j], paramNames)
		filters[i - 1] = [parseFilter(name), args, name]
	}
	const identities = (this.identities = cleanIdentities())
	this.simple = identities.length === 1 && isSimpleExpr(codeSplit[0]) ? codeSplit[0] : false

	escaped.length = 0
	userIdentityHandler = undefined
	userKeyWords = undefined
}
inherit(Expression, {
	execute(scope, args) {
		apply(this.executor, scope, args)
	},
	eachFilter(cb, scope, args) {
		const filters = this.filters
		let i = 0,
			l = filters.length,
			filter
		for (; i < l; i++) {
			filter = filters[i]
			if (cb(filter[0], new FilterParams(filter[1], scope, args)) === false) return false
		}
	},
	reachFilter(cb, scope, args) {
		const filters = this.filters
		let i = filters.length,
			filter
		while (i--) {
			filter = filters[i]
			if (cb(filter[0], new FilterParams(filter[1], scope, args)) === false) return false
		}
	}
})

function FilterParams(params, scope, args) {
	this.params = params
	this.scope = scope
	this.args = args
}
inherit(FilterParams, {
	get(index, val) {
		const { scope, args, params } = this
		if (arguments.length) return params[index] ? apply(params[index], scope, args) : val

		let i = params.length
		const arr = new Array(i)
		while (i--) {
			arr[i] = apply(params[i], scope, args)
		}
		return arr
	},
	iter() {
		const { scope, args, params } = this
		const len = params.length
		let i = 0
		return function() {
			return i < len ? apply(params[i++], scope, args) : STOP
		}
	}
})

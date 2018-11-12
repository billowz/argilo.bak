import { assert } from 'devlevel'
import { match, and, or, any, option, many, anyOne, UNATTACH, UNCAPTURABLE } from '../common/ASTBuilder'
import { makeMap, reEscape } from '../helper'
import { escapeString } from '../common/format'

const EXPR_START = '{',
	EXPR_END = '}'

const AutoCloseElems = makeMap('input'),
	ContentElems = makeMap('textarea')

const EXPR_START_LEN = EXPR_START.length,
	EXPR_END_LEN = EXPR_END.length

const EXPR_KEY_WORDS = `"'\`[{`

const EXPR_KEYS = match(EXPR_KEY_WORDS.split(''), UNATTACH),
	EXPR_STR = match(/"(?:[^\\"\n]|\\.)*"|'(?:[^\\'\n]|\\.)*'|`(?:[^\\`]|\\.)*`/, false, `'"\``, UNATTACH),
	ExprObject = and(
		'ExprObject',
		() => [
			'{',
			anyOne(
				'ObjBody',
				[
					EXPR_STR, // match by "'`
					ExprObject, // match by {
					ExprArray, // match by ]
					EXPR_KEYS, // consume start char when EXPR_STR | ExprObject | ExprArray match failed
					new RegExp(`[^${reEscape(EXPR_KEY_WORDS + '}')}]+`), // consume chars which before start codes of EXPR_STR | ExprObject | ExprArray and "}"
				],
				UNATTACH
			),
			'}',
		],
		UNATTACH
	),
	ExprArray = and('ExprArray', () => ['[', anyOne('ArrayBody', [EXPR_STR, ExprObject, ExprArray, EXPR_KEYS, new RegExp(`[^${reEscape(EXPR_KEY_WORDS + ']')}]+`)], UNATTACH), ']']),
	Expr = and(
		'Expr',
		[
			['ExprStart', EXPR_START, attachOffset],
			anyOne(
				'ExprBody',
				[EXPR_STR, ExprObject, ExprArray, match((EXPR_KEY_WORDS + EXPR_START[0]).split(''), UNATTACH), new RegExp(`[^${reEscape(EXPR_KEY_WORDS + EXPR_START[0] + EXPR_END[0])}]+`)],
				UNATTACH
			),
			['ExprEnd', EXPR_END, attachOffset],
		],
		(d, rs, stream) => {
			const content_start = d[0],
				expr_end = d[1]
			rs.add([stream.orgbuff.substring(content_start, expr_end - EXPR_END_LEN), content_start - EXPR_START_LEN, expr_end])
		}
	)

function createStringRule(name, mask, mline) {
	return and(
		name,
		[
			match(mask, attachOffset),
			anyOne([
				Expr,
				EXPR_START[0], // consume expr start char when parse expr failed
				new RegExp(`(?:[^\\\\${mline ? '' : '\\n'}${mask}${reEscape(EXPR_START[0])}]|\\\\.)+`), // string fragment
			]),
			match(mask, attachOffset),
		],
		(d, rs, stream) => {
			const buff = stream.orgbuff
			let start = d[0],
				end = d[2] - 1,
				exprs = d[1]
			if (exprs.length) {
				const offset = start - 1
				var i = 0,
					l = exprs.length,
					estart
				const expr = []

				for (; i < l; i++) {
					estart = exprs[i][1]
					if (start < estart) expr.push(exprStr(buff, start, estart))
					expr.push(`(${exprs[i][0]})`)
					start = exprs[i][2]
				}
				if (start < end) expr.push(exprStr(buff, start, end))

				rs.add(['expr', expr.join(' + '), offset, end + 1])
			} else {
				rs.add(['string', buff.substring(start, end)])
			}
		}
	)

	function exprStr(buff, start, end) {
		return `"${escapeString(buff.substring(start, end))}"`
	}
}

const ATTR_NAME = match('AttrName', /([@:$_a-zA-Z][\w-\.]*)\s*/, 1),
	AttrValue = or(
		'AttrValue',
		[
			createStringRule('SQString', "'"),
			createStringRule('DQString', '"'),
			createStringRule('MString', '`', true),
			and(Expr, attachValue('expr', expr => expr[0][0])),
			match('Number', /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/, '-0123456789', attachValue('number', num => +num)),
			match('NaN', attachStaticValue('number', NaN)),
			match('undefined', attachStaticValue('undefined', undefined)),
			match('null', attachStaticValue('null', undefined)),
			match('true', attachStaticValue('boolean', true)),
			match('false', attachStaticValue('boolean', false)),
		],
		{
			capturable: false,
			attach(val, rs) {
				rs.add(val[0])
			},
		}
	),
	Attrs = any('Attrs', [ATTR_NAME, option('AttrValue', [[/=\s*/, false, '=', UNATTACH], AttrValue, /\s*/])], (d, rs) => {
		const attrs = {}
		for (let i = 0, l = d.length; i < l; i += 2) attrs[d[i]] = d[i + 1][0]
		rs.add(attrs)
	})

const ELEM_NAME_REG = '[_a-zA-Z][\\w-]*',
	ELEM_NAME = match('ElemName', new RegExp(`<(${ELEM_NAME_REG})\\s*`), 1, '<'),
	NodeCollection = anyOne('NodeCollection', () => [
		Elem,
		and(Expr, (d, rs, stream) => {
			rs.add({ type: 'expr', data: d[0][0] })
		}),
		match('<', (d, rs, stream, rule) => {
			//consume one char when Elem match failed
			if (stream.nextCode() === 47)
				// is close element
				return rule.error(stream, 'expect: /<[^/]/', true)
			attachText(d, rs, stream, rule) // not element
		}),
		match(EXPR_START[0], attachText), // consume one char when Expr match failed
		match(new RegExp(`[^\\\\<${reEscape(EXPR_START[0])}]+|\\\\${reEscape(EXPR_START[0])}`), attachText),
	]),
	Elem = and(
		'Elem',
		[
			ELEM_NAME,
			Attrs,
			or('ElemBody', [
				match(/\/>\s*/, false, '/', UNATTACH),
				and('childNodes', [
					match(/>/, false, '>', UNATTACH),
					NodeCollection,
					option([match('ElemClose', new RegExp(`<\/(${ELEM_NAME_REG})>\\s*`), 1, '<')], (close, childNodesResult, stream) => {
						const closeTag = close[0],
							elemResult = childNodesResult.parent.parent,
							tag = elemResult.data[0]

						if (closeTag) {
							if (closeTag !== tag) {
								if (AutoCloseElems[tag]) {
									stream.reset()
								} else {
									return `expect: </${tag}>`
								}
							}
						} else if (!AutoCloseElems[tag]) {
							return `expect: </${tag}>`
						}
					}),
				]),
			]),
		],
		(d, rs) => {
			const tag = d[0],
				children = d[2][0] && d[2][0][0],
				elem = { type: 'elem', tag, attrs: d[1], children }

			rs.add(elem)

			if (children && AutoCloseElems[tag]) {
				rs.addAll(children)
				children.length = 0
			}
		}
	)

function attachText(text, rs) {
	const data = rs.data,
		len = data.length
	let prev
	if (len && (prev = data[len - 1]) && prev.type === 'text') {
		prev.data += text
	} else {
		rs.add({ type: 'text', data: text })
	}
}

const ElemContent = and('Elem-Content', [/\s*/, many(Elem), match('EOF', /\s*$/, UNATTACH)], (d, rs) => {
	rs.addAll(d[0])
}).init()

export default ElemContent

function attachValue(type, valHandler) {
	return function(value, rs) {
		rs.add([type, valHandler(value)])
	}
}

function attachStaticValue(type, val) {
	return attachValue(type, v => v)
}

function attachOffset(d, rs, stream) {
	rs.add(stream.orgOffset())
}

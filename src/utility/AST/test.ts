import { makeMap } from '../collection'
import { match, discardMatch, and, anyOne, many, option, or, any } from './api'
import { reEscape } from '../reg'
import { escapeStr } from '../string'
import { MatchContext } from './MatchContext'
import { Rule } from './Rule'

const EXPR_START = '{',
	EXPR_END = '}'

const AutoCloseElems = makeMap('input'),
	ContentElems = makeMap('textarea')

const EXPR_START_LEN = EXPR_START.length,
	EXPR_END_LEN = EXPR_END.length

const EXPR_KEY_WORDS = `"'\`[{`

and('a', () => [], discardMatch)

const EXPR_KEYS = match(EXPR_KEY_WORDS.split(''), discardMatch),
	EXPR_STR = match(/"(?:[^\\"\n]|\\.)*"|'(?:[^\\'\n]|\\.)*'|`(?:[^\\`]|\\.)*`/, `'"\``, false, discardMatch),
	ExprObject = and(
		'ExprObject',
		() => [
			'{',
			anyOne(
				'ObjBody',
				[
					EXPR_STR,
					ExprObject,
					ExprArray,
					EXPR_KEYS, // consume start char when EXPR_STR | ExprObject | ExprArray match failed
					new RegExp(`[^${reEscape(EXPR_KEY_WORDS + '}')}]+`) // consume chars which before start codes of EXPR_STR | ExprObject | ExprArray and "}"
				],
				discardMatch
			),
			'}'
		],
		discardMatch
	),
	ExprArray = and('ExprArray', () => [
		'[',
		anyOne(
			'ArrayBody',
			[EXPR_STR, ExprObject, ExprArray, EXPR_KEYS, new RegExp(`[^${reEscape(EXPR_KEY_WORDS + ']')}]+`)],
			discardMatch
		),
		']'
	]),
	Expr = and(
		'Expr',
		[
			['ExprStart', EXPR_START, attachOffset],
			anyOne(
				'ExprBody',
				[
					EXPR_STR,
					ExprObject,
					ExprArray,
					match((EXPR_KEY_WORDS + EXPR_START[0]).split(''), discardMatch),
					new RegExp(`[^${reEscape(EXPR_KEY_WORDS + EXPR_START[0] + EXPR_END[0])}]+`)
				],
				discardMatch
			),
			['ExprEnd', EXPR_END, attachOffset]
		],
		(data: any, len: number, ctx: MatchContext) => {
			const content_start = data[0],
				expr_end = data[1]
			ctx.add([
				ctx.source.buff.substring(content_start, expr_end - EXPR_END_LEN),
				content_start - EXPR_START_LEN,
				expr_end
			])
		}
	)

function createStringRule(name, mask, mline?) {
	return and(
		name,
		[
			match(mask, attachOffset),
			anyOne([
				Expr,
				EXPR_START[0], // consume expr start char when parse expr failed
				new RegExp(`(?:[^\\\\${mline ? '' : '\\n'}${mask}${reEscape(EXPR_START[0])}]|\\\\.)+`) // string fragment
			]),
			match(mask, attachOffset)
		],
		(data: any, len: number, ctx: MatchContext) => {
			const buff = ctx.source.buff
			let start = data[0],
				end = data[2] - 1,
				exprs = data[1]
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

				ctx.add(['expr', expr.join(' + '), offset, end + 1])
			} else {
				ctx.add(['string', buff.substring(start, end)])
			}
		}
	)

	function exprStr(buff, start, end) {
		return `"${escapeStr(buff.substring(start, end))}"`
	}
}

const ATTR_NAME = match('AttrName', /([@:$_a-zA-Z][\w-\.]*)\s*/, 1),
	AttrValue = or(
		'AttrValue',
		[
			createStringRule('SQString', "'"),
			createStringRule('DQString', '"'),
			createStringRule('MString', '`', true),
			and([Expr], attachValue('expr', expr => expr[0][0])),
			match('Number', /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/, '-0123456789', attachValue('number', num => +num)),
			match('NaN', attachStaticValue('number', NaN)),
			match('undefined', attachStaticValue('undefined', undefined)),
			match('null', attachStaticValue('null', undefined)),
			match('true', attachStaticValue('boolean', true)),
			match('false', attachStaticValue('boolean', false))
		],
		false,
		(data: any, len: number, ctx: MatchContext) => ctx.add(data[0])
	),
	Attrs = any(
		'Attrs',
		[ATTR_NAME, option('AttrValue', [[/=\s*/, false, '=', discardMatch], AttrValue, /\s*/])],
		(data, length, ctx) => {
			const attrs = {}
			for (let i = 0, l = data.length; i < l; i += 2) attrs[data[i]] = data[i + 1][0]
			ctx.add(attrs)
		}
	)

const ELEM_NAME_REG = '[_a-zA-Z][\\w-]*',
	ELEM_NAME = match('ElemName', new RegExp(`<(${ELEM_NAME_REG})\\s*`), 1, '<'),
	NodeCollection = anyOne('NodeCollection', () => [
		Elem,
		and([Expr], (data: any, len: number, ctx: MatchContext) => {
			ctx.add({ type: 'expr', data: data[0][0] })
		}),
		match('<', (data: any, len: number, ctx: MatchContext, rule: Rule) => {
			//consume one char when Elem match failed
			if (ctx.nextCode() === 47)
				// is close element
				return rule.mkErr('expect: /<[^/]/', ctx)
			attachText(data, len, ctx) // not element
		}),
		match(EXPR_START[0], attachText), // consume one char when Expr match failed
		match(new RegExp(`[^\\\\<${reEscape(EXPR_START[0])}]+|\\\\${reEscape(EXPR_START[0])}`), attachText)
	]),
	Elem = and(
		'Elem',
		[
			ELEM_NAME,
			Attrs,
			or('ElemBody', [
				match(/\/>\s*/, false, '/', discardMatch),
				and('childNodes', [
					match(/>/, false, '>', discardMatch),
					NodeCollection,
					option([match('ElemClose', new RegExp(`<\/(${ELEM_NAME_REG})>\\s*`), 1, '<')], (data, len, ctx) => {
						const closeTag = data[0],
							pctx = ctx.parent.parent,
							tag = pctx.data[0]

						if (closeTag) {
							if (closeTag !== tag) {
								if (AutoCloseElems[tag]) {
									ctx.reset()
								} else {
									return `expect: </${tag}>`
								}
							}
						} else if (!AutoCloseElems[tag]) {
							return `expect: </${tag}>`
						}
					})
				])
			])
		],
		(data: any, len: number, ctx: MatchContext) => {
			const tag = data[0],
				children = data[2][0] && data[2][0][0],
				elem = { type: 'elem', tag, attrs: data[1], children }

			ctx.add(elem)

			if (children && AutoCloseElems[tag]) {
				ctx.addAll(children)
				children.length = 0
			}
		}
	)

function attachText(text: string, length: number, ctx: MatchContext) {
	const data = ctx.data,
		len = data.length
	let prev
	if (len && (prev = data[len - 1]) && prev.type === 'text') {
		prev.data += text
	} else {
		ctx.add({ type: 'text', data: text })
	}
}

export const ElemContent = and(
	'Elem-Content',
	[/\s*/, many([Elem]), match('EOF', /\s*$/, discardMatch)],
	(data: any, len: number, ctx: MatchContext) => {
		ctx.addAll(data[0])
	}
)

ElemContent.init()

function attachValue(type, valHandler) {
	return function(data: any, len: number, ctx: MatchContext) {
		ctx.add([type, valHandler(data)])
	}
}

function attachStaticValue(type, val) {
	return attachValue(type, v => v)
}

function attachOffset(data: any, len: number, ctx: MatchContext) {
	ctx.add(ctx.currPos())
}

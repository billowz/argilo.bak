import { match, or, attachMatch, appendMatch, option, any, discardMatch, and, anyOne, many } from '../api'
import { MatchContext } from '../MatchContext'
import { Rule, MatchError, onMatchCallback } from '../Rule'
import { genCharCodes } from '../util'
import { makeMap } from '../../collection'

type Element = {
	tag: string
	attrs: {}
	children?: Node[]
	content?: string
}

type Text = {
	text: string
}

type Node = Text | Element

const VOID_ELEM = makeMap('input,br,hr', 1),
	CONTENT_ELEM = makeMap('script,style,textarea', 1)

const UNDEFINED = match('undefined', attachMatch(undefined)),
	NULL = match('null', attachMatch(null)),
	BOOLEAN = match('boolean', /true|false/, 'tf', attachMatch(b => b === 'true')),
	NUMBER = match(
		'number',
		/[+-]?(?:0x[\da-f]+|0X[\dA-F]+|0[oO][0-7]+|0[bB][01]+|(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
		'+-0123456789',
		attachMatch(n => +n)
	),
	NAN = match('NaN', attachMatch(n => NaN)),
	STRING = match('string', /"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)'/, -2, `'"`)

const ATTR_NAME = match(
		'attr-name',
		/([@:$_a-zA-Z][\w-\.]*)\s*/,
		1,
		['@', ':', '$', '_'].concat(genCharCodes('a', 'z', true) as any[])
	),
	// prettier-ignore
	ATTR_VALUE = or('attr-value', [
		UNDEFINED,
		BOOLEAN,
		NUMBER,
		NAN,
		STRING
	], appendMatch),
	// prettier-ignore
	ATTRS = any('attrs', [
		ATTR_NAME,
		option([
			['attr-op', /=\s*/, '='],
			ATTR_VALUE,
			/\s*/
		])
	], (data, l, ctx) => {
			const attrs = {}
			for (let i = 0, l = data.length; i < l; i += 2) attrs[data[i]] = data[i + 1][0]
			ctx.add(attrs)
	})

const ELEM_NAME = match('elem-open', /<([_a-zA-Z][\w-]*)\s*/, 1, '<'),
	ELEM = and(
		'elem',
		() => [
			ELEM_NAME,
			ATTRS,
			or([
				['elem-slash-close', /\/>\s*/, '/'],
				match('elem-close', />\s*/, false, '>', (d, l, ctx) => {
					const parent = ctx.parent,
						tag: string = (ctx.data = parent.result[0]),
						rule: Rule = CONTENT_ELEM[tag] ? ELEM_CONTENT : ELEM_CHILDREN,
						err: MatchError = rule.match(ctx),
						serr = err.target
					if (serr.msg) return err
					const sctx = serr.context
					ctx.margeState(sctx)
					ctx.addAll(sctx.result)
				})
			])
		],
		(d, l, ctx) => {
			const tag = d[0]
			const elem: Element = { tag, attrs: d[1] }
			ctx.add(elem)
			VOID_ELEM[tag]
				? ctx.addAll(d[2])
				: CONTENT_ELEM[tag]
				? (elem.content = d[2][0] || '')
				: d[2].length && (elem.children = d[2])
		}
	)

const ELEM_CHILDREN = elemBody('elem-children', [ELEM], (m, l, ctx, rule) => {
		const tag = ctx.data
		return rule.mkErr(
			tag === m[1]
				? VOID_ELEM[tag] && ctx.resultSize()
					? `<${tag}> have no children`
					: null
				: VOID_ELEM[tag]
				? (ctx.advance(-l), null)
				: `expect: </${tag}>`,
			ctx,
			false
		)
	}),
	ELEM_CONTENT = elemBody('elem-content', [], (m, l, ctx, rule) => {
		if (ctx.data === m[1]) return rule.mkErr(null, ctx, false)
		attachText(m[0], l, ctx)
	})

function elemBody(name: string, rules: Rule[], onEnd: onMatchCallback) {
	return anyOne(
		name,
		rules.concat([
			match('elem-end', /<\/([_a-zA-Z][\w-]*)>\s*/, true, '<', onEnd),
			match('text', /.[^<]*/, 0, false, attachText, (err, ctx) => `expect: </${ctx.data}>`)
		]),
		appendMatch
	)
}

// prettier-ignore
export const html = and('html', [
		/\s*/,
		many('elems', [ELEM]),
		['EOF', /\s*$/]
	], (data: any, len: number, ctx: MatchContext) => {
		ctx.addAll(data[0])
	}).init()

function attachText(text: string, length: number, ctx: MatchContext) {
	const data = ctx.result,
		len = data.length
	let prev: Node
	if (len && (prev = data[len - 1]) && (prev as any).text) {
		;(prev as Text).text += text
	} else {
		ctx.add({ text })
	}
}

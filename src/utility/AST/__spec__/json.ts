import { arr2obj } from '../../collection'
import { match, appendMatch, attachMatch, and, option, or, any } from '../api'

var UNDEFINED = match('undefined', attachMatch(undefined)),
	NULL = match('null', attachMatch(null)),
	BOOLEAN = match('boolean', /true|false/, 'tf', attachMatch(b => b === 'true')),
	NUMBER = match(
		'number',
		/[+-]?(?:0x[\da-f]+|0X[\dA-F]+|0[oO][0-7]+|0[bB][01]+|(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
		'+-0123456789',
		attachMatch(n => +n)
	),
	STRING = match('string', /"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)'|`((?:[^\\`]|\\.)*)`/, -3, `'"\``)

var VALUE = or('value', () => [UNDEFINED, NULL, BOOLEAN, NUMBER, STRING, ARRAY, OBJECT], appendMatch)

var OBJECT_PROPERTY = and('property', [/\s*/, STRING, /\s*:\s*/, VALUE, /\s*/]),
	OBJECT = and(
		'object',
		['{', option('properties', [OBJECT_PROPERTY, any([',', OBJECT_PROPERTY], appendMatch)], appendMatch), '}'],
		attachMatch(data => arr2obj(data, d => d))
	)

var ARRAY_ELEM = and('element', [/\s*/, VALUE, /\s*/], appendMatch),
	ARRAY = and('array', ['[', option('elements', [ARRAY_ELEM, any([',', ARRAY_ELEM], appendMatch)]), ']'], appendMatch)

export var json = and([/\s*/, VALUE, /\s*$/], appendMatch).init()

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
	STRING = match('string', /"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)'/, -2, `'"`),
	OBJ_OR_SCOPE = and(['{', or([STRING]), '}'])

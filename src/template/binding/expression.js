import {
  parseExpr,
  createClass
} from 'ilos'
import {
  expression
} from '../parser'

export const ContextKeyword = '$this'
export const ElementKeyword = '$el'
export const EventKeyword = '$event'
export const BindingKeyword = '$binding'
const ScopeKey = '#',
  PropsKey = '@'

export function expressionParser(prefix, expr, func, write) {
  var path = parseExpr(expr)
  switch (path[0]) {
    case ElementKeyword:
    case EventKeyword:
    case BindingKeyword:
      return null
    case 'this':
    case ContextKeyword:
      path.shift()
      break
  }
  expr = path.join('.')
  return {
    identity: !func && !write && expr,
    expr: prefix + ((func || write) ? `$binding.findScope('${path[0]}', true).${expr}` : `${ContextKeyword}.${expr}`)
  }
}

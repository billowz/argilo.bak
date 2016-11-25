import {
  parseExpr
} from 'ilos'

export const ContextKeyword = '$context'
export const ElementKeyword = '$el'
export const EventKeyword = '$event'
export const BindingKeyword = '$binding'
const ScopeKey = '#',
  PropsKey = '@'
export function expressionParser(prefix, expr, realContext, ident) {
  switch (prefix) {
    case ScopeKey:
      expr = `scope.${expr}`
      prefix = ''
      break
    case PropsKey:
      expr = `props.${expr}`
      prefix = ''
      break
    default:
      {
        var path = parseExpr(expr)
        switch (path[0]) {
          case ElementKeyword:
          case EventKeyword:
            return null
          case 'this':
          case ContextKeyword:
            path.shift()
            break
        }
        expr = path.join('.')
      }
  }
  return {
    identity: ident && expr,
    expr: prefix + (realContext ? `$binding.exprContext('${path[0]}').${expr}` : `${ContextKeyword}.${expr}`)
  }
}

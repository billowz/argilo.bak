import {
  parseExpr
} from 'ilos'

export const ContextKeyword = '$context'
export const ElementKeyword = '$el'
export const EventKeyword = '$event'
export const BindingKeyword = '$binding'
const ScopeKey = '#',
  PropsKey = '@'

export function expressionParser(prefix, expr, func, write) {
  var path
  switch (prefix) {
    case ScopeKey:
      expr = `scope.${expr}`
      prefix = ''
      path = parseExpr(expr)
      break
    case PropsKey:
      expr = `props.${expr}`
      prefix = ''
      path = parseExpr(expr)
      break
    default:
      {
        path = parseExpr(expr)
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
      }
  }
  return {
    identity: !func && !write && expr,
    expr: prefix + ((func || write) ? `$binding.propContext('${path[0]}').${expr}` : `${ContextKeyword}.${expr}`)
  }
}

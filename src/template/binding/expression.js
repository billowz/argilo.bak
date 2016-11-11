import {
  parseExpr
} from 'ilos'

export const ContextKeyword = '$context'
export const ElementKeyword = '$el'
export const EventKeyword = '$event'
export const BindingKeyword = '$binding'

export function expressionParser(expr, realContext, ident) {
  let path = parseExpr(expr)
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
  return {
    identity: ident && expr,
    expr: realContext ? `$binding.exprContext('${path[0]}').${expr}` : `${ContextKeyword}.${expr}`
  }
}

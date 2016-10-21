import translate from '../translate'
import configuration from '../configuration'
import {
  dynamicClass,
  each,
  map,
  keys,
  reverseConvert,
  isString,
  isArray,
} from 'ilos'

const keywords = reverseConvert('argilo,window,document,Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat'.split(','), () => true),
  wsReg = /\s/g,
  newlineReg = /\n/g,
  transformReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
  restoreReg = /"(\d+)"/g,
  identityReg = /[^\w$\.](?:(?:this\.)?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/g,
  propReg = /^[A-Za-z_$][\w$]*/,
  simplePathReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,
  literalValueReg = /^(?:true|false|null|undefined|Infinity|NaN)$/,
  exprReg = /\s*\|\s*(?:\|\s*)*/,
  applyFuncReg = /\.call|\.apply$/,
  thisReg = /^this\./

let userkeywords = {}

configuration.register('keywords', [], 'init', (val) => {
  if (isString(val))
    val = val.replace(/\\s+/g, '').split(',')
  if (!isArray(val))
    throw new Error('Invalid keywords: ' + val)
  userkeywords = reverseConvert(val, () => true)
  return true
})

let saved = []

function transform(str, isString) {
  let i = saved.length
  saved[i] = isString ? str.replace(newlineReg, '\\n') : str
  return `"${i}"`
}

function restore(str, i) {
  return saved[i]
}

let identities, params,
  scopeProvider

function defaultScopeProvider() {
  return 'this'
}

function initStatus(_params, _scopeProvider) {
  identities = {}
  scopeProvider = _scopeProvider || defaultScopeProvider
  params = _params.__MAP__
  if (!params)
    params = _params.__MAP__ = reverseConvert(_params, () => true)
}

function cleanStates() {
  identities = undefined
  params = undefined
  scopeProvider = undefined
  saved.length = 0
}

function rewrite(raw, idx, str) {
  let prefix = raw.charAt(0),
    userExpr = raw.slice(1),
    expr = userExpr.replace(thisReg, ''),
    prop = expr.match(propReg)[0]

  if (expr == userExpr && (keywords[prop] || params[prop] || userkeywords[prop]))
    return raw

  let nextIdx = idx + raw.length,
    nextChar = str.charAt(nextIdx++),
    realScope = false,
    ident = true

  switch (nextChar) {
    case '(':
      realScope = !applyFuncReg.test(expr)
      ident = false
      break
    case '=':
      realScope = str.charAt(nextIdx) != '='
      break
    case '/':
    case '*':
    case '+':
    case '-':
    case '%':
    case '&':
    case '&':
      realScope = str.charAt(nextIdx) == '='
      break
    case '>':
    case '<':
      realScope = str.charAt(nextIdx) == nextChar && str.charAt(nextIdx + 1) == '='
      break
  }
  if (!realScope && ident)
    identities[expr] = true
  return `${prefix}${scopeProvider(expr, realScope)}.${expr}`
}


function makeExecutor(body, params) {
  params = params.slice()
  params.push(`return ${body};`)
  try {
    return Function.apply(Function, params)
  } catch (e) {
    throw Error(`Invalid expression. Generated function body: ${body}`)
  }
}

function complileExpr(body) {
  return (' ' + body).replace(identityReg, rewrite).replace(restoreReg, restore)
}

function compileFilter(exprs, params) {
  return map(exprs, (expr) => {
    let args = expr.replace(/,?\s+/g, ',').split(',')
    return {
      name: args.shift().replace(restoreReg, restore),
      argExecutors: map(args, (expr) => {
        return makeExecutor(complileExpr(expr), params)
      })
    }
  })
}

export function isSimplePath(expr) {
  return simplePathReg.test(expr) && !literalValueReg.test(expr) && expr.slice(0, 5) !== 'Math.'
}

const Expression = dynamicClass({
  constructor(fullExpr, params) {
    let exprs = fullExpr.replace(transformReg, transform).split(exprReg),
      expr = exprs.shift().replace(wsReg, ''),
      filterExprs = exprs

    this.expr = expr.replace(restoreReg, restore)
    this.filterExprs = map(expr => expr.replace(restoreReg, restore))
    this.fullExpr = fullExpr
    this.params = params
    this.executor = makeExecutor(complileExpr(expr), params)
    this.filters = compileFilter(filterExprs, params)
    this.identities = keys(identities)
    this.simplePath = isSimplePath(this.expr)
  },
  executeFilter(scope, params, data, transform) {
    each(this.filters, filter => {
      if (transform === false && !translate.get(filter.name))
        return
      let args = map(filter.argExecutors, (executor) => {
          return executor.apply(scope, params)
        }),
        rs
      if (transform !== false) {
        rs = translate.transform(filter.name, scope, data, args)
      } else {
        rs = translate.restore(filter.name, scope, data, args)
      }
      if (rs.replace || rs.stop)
        data = rs.data
      return !rs.stop
    })
    return data
  },
  restore(scope, params, data) {
    return this.executeFilter(scope, params, data, false)
  },
  execute(scope, params) {
    return this.executor.apply(scope, params)
  },
  executeAll(scope, params) {
    return this.executeFilter(scope, params, this.executor.apply(scope, params), true)
  },
  isSimple() {
    return this.simplePath
  }
})

const cache = {}

export default function expression(expr, params, scopeProvider) {
  let rs = cache[expr]
  if (!rs) {
    initStatus(params, scopeProvider)
    cache[expr] = rs = new Expression(expr, params)
    cleanStates()
  }
  return rs
}

expression.cache = cache

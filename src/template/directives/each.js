import {
  Directive,
  ContextKeyword,
  ElementKeyword,
  BindingKeyword,
  expressionParser
} from '../binding'
import {
  expression
} from '../parser'
import dom from '../../dom'
import {
  proxy
} from 'observi'
import {
  dynamicClass,
  each,
  map,
  get,
  create
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword],
  eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/

export default Directive.register('each', dynamicClass({
  extend: Directive,
  independent: true,
  block: true,
  priority: 10,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    let token = this.expr.match(eachReg)
    if (!token)
      throw Error(`Invalid Expression[${this.expr}] on Each Directive`)

    this.dataExpr = expression(token[2], expressionArgs, expressionParser)
    this.indexExpr = token[4]

    let aliasToken = token[1].match(eachAliasReg)
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`)

    this.valueAlias = aliasToken[2] || aliasToken[5]
    this.keyAlias = aliasToken[4] || aliasToken[7]

    this.begin = document.createComment('each begin')
    this.end = document.createComment('each end')
    dom.replace(this.el, this.begin)
    dom.after(this.end, this.begin)
    this.el = undefined
    this.version = 1
  },
  update(data) {
    let templateParser = this.templateParser,
      ctx = this.realContext(),
      indexExpr = this.indexExpr,
      used = this.used,
      version = this.version++,
      indexMap = this.used = {},
      descs = map(data, (item, idx) => {
        let index = indexExpr ? get(item, indexExpr) : idx, // read index of data item
          reuse = used && used[index],
          desc

        if (reuse && reuse.version === version)
          reuse = undefined

        desc = reuse || {
          index: index
        }
        desc.version = version
        desc.data = proxy(item)
        indexMap[index] = desc
        return desc
      }),
      idles = undefined,
      before = this.begin
    if (used) {
      idles = []
      each(used, (desc) => {
        if (desc.version != version)
          idles.push(desc)
      })
    }
    each(descs, (desc, i) => {
      let isNew = false
      if (!desc.context) {
        let idle = idles && idles.pop()
        if (!idle) {
          desc.context = this.createChildContext(ctx, desc.data, desc.index)
          isNew = true
        } else {
          desc.context = idle.context
        }
      }
      if (!isNew)
        this.updateChildContext(desc.context, desc.data, desc.index)
      desc.context.after(before, true, false)
      before = desc.context.el
      data[i] = proxy(desc.data)
    })
    if (idles)
      each(idles, (idle) => idle.context.remove(true, false))
  },
  createChildContext(parent, value, index) {
    let ctx = parent.clone(this.templateParser),
      va = this.valueAlias,
      ka = this.keyAlias,
      $watchs = ctx.$watchs
    ctx[va] = value
    $watchs[va] = true
    if (ka) {
      ctx[ka] = index
      $watchs[ka] = true
    }
    return ctx
  },
  updateChildContext(ctx, value, index) {
    ctx = proxy(ctx)
    ctx[this.valueAlias] = value
    if (this.keyAlias)
      ctx[this.keyAlias] = index
  },
  bind() {
    each(this.dataExpr.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.target())
  },
  unbind() {
    each(this.dataExpr.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  target() {
    let ctx = this.context()
    return this.dataExpr.executeAll(ctx, [ctx, this.el, this])
  },
  observeHandler(expr, target) {
    if (this.dataExpr.isSimple()) {
      var ctx = this.context()
      this.update(this.dataExpr.executeFilter(ctx, [ctx, this.el, this], target))
    } else {
      target = this.target()
    }
    this.update(target)
  }
}))

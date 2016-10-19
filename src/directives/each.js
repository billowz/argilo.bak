import {
  Directive
} from '../binding'
import Template from '../template'
import _ from 'ilos'
import observi from 'observi'
import dom from '../dom'

const eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/

export default Directive.register('each', _.dynamicClass({
  extend: Directive,
  independent: true,
  block: true,
  priority: 10,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    this.observeLenHandler = this.observeLenHandler.bind(this)
    let token = this.expr.match(eachReg)
    if (!token)
      throw Error(`Invalid Expression[${this.expr}] on Each Directive`)

    this.scopeExpr = token[2]
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
    let domParser = this.domParser,
      parentScope = this.realScope(),
      indexExpr = this.indexExpr,
      used = this.used,
      version = this.version++,
      indexMap = this.used = {},
      descs = _.map(data, (item, idx) => {
        let index = indexExpr ? _.get(item, indexExpr) : idx, // read index of data item
          reuse = used && used[index],
          desc

        if (reuse && reuse.version === version)
          reuse = undefined

        desc = reuse || {
          index: index
        }
        desc.version = version
        desc.data = observi.proxy(item)
        indexMap[index] = desc
        return desc
      }),
      idles = undefined,
      before = this.begin
    if (used) {
      idles = []
      _.each(used, (desc) => {
        if (desc.version != version)
          idles.push(desc)
      })
    }
    _.each(descs, (desc, i) => {
      let isNew = false
      if (!desc.scope) {
        let idle = idles && idles.pop()
        if (!idle) {
          desc.scope = this.createScope(parentScope, desc.data, desc.index)
          desc.tpl = domParser.complie(desc.scope)
          isNew = true
        } else {
          desc.scope = idle.scope
          desc.tpl = idle.tpl
        }
      }
      if (!isNew)
        this.initScope(desc.scope, desc.data, desc.index)
      desc.tpl.after(before)
      before = desc.tpl.el
      data[i] = observi.proxy(desc.data)
    })
    if (idles)
      _.each(idles, (idle) => idle.tpl.destroy())
  },
  createScope(parentScope, value, index) {
    let scope = _.create(parentScope)
    scope.$parent = parentScope
    scope.$eachContext = this
    this.initScope(scope, value, index, true)
    return scope
  },
  initScope(scope, value, index, isCreate) {
    if (!isCreate)
      scope = observi.proxy(scope)
    scope[this.valueAlias] = value
    if (this.keyAlias)
      scope[this.keyAlias] = index
  },
  bind() {
    this.observe(this.scopeExpr, this.observeHandler)
    this.observe(this.scopeExpr + '.length', this.observeLenHandler)
    this.update(this.target())
  },
  unbind() {
    this.unobserve(this.scopeExpr, this.observeHandler)
    this.unobserve(this.scopeExpr + '.length', this.observeLenHandler)
  },
  target() {
    return this.get(this.scopeExpr)
  },
  observeHandler(expr, target) {
    this.update(target)
  },
  observeLenHandler() {
    this.update(this.target())
  }
}))

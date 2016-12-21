import {
  Directive,
  ContextKeyword,
  ElementKeyword,
  BindingKeyword,
  expressionParser
} from '../binding'
import {
  Controller
} from '../Controller'
import {
  getCompontent,
  getAllCompontents
} from '../Compontent'
import {
  expression
} from '../parser'
import dom from '../../dom'
import {
  proxy
} from 'observi'
import logger from '../log'
import {
  each,
  isArrayLike
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword]
Controller.addProp('cmps', undefined)
Controller.addProp('holders', undefined)
export const CompontentDirective = Directive.register('cmp', {
  params: ['scope', 'props'],
  type: 'inline-template',
  priority: 8,
  constructor() {
    this.super(arguments)
    this.scopeHandler = this.scopeHandler.bind(this)
    this.propsHandler = this.propsHandler.bind(this)
    this.compontent = getCompontent(this.expr)
    if (!this.compontent)
      throw new Error(`Compontent[${this.expr}] is not defined`)
    this.initCmp()
    this.initSlot()
  },
  initCmp() {
    let {
      scope,
      props
    } = this.params,
      scopeExpr = this.scopeExpr = scope && expression(scope, expressionArgs, expressionParser),
      propsExpr = this.propsExpr = props && expression(props, expressionArgs, expressionParser),
      ct = this.controller = this.compontent.compile(this.executeExpr(scopeExpr), this.executeExpr(propsExpr)),
      r = this.root
    this.mask = document.createComment(`Compontent[${this.expr}]`)
    dom.replace(this.el, this.mask)
    dom.after(ct.el, this.mask)
    this.group.updateEl(isArrayLike(ct.el) ? ct.el[0] : ct.el, this)
    this.el = undefined
    if (!r.cmps) {
      r.cmps = [ct]
    } else {
      r.cmps.push(ct)
    }
  },
  initSlot() {
    let holders = this.controller.holders,
      defaultHolder
    if (holders) {
      defaultHolder = holders['default']
      try {
        this.slot = this.ctx.clone(this.templateParser, ctx => ctx.holders = holders)
        if (defaultHolder && !defaultHolder.bindSlot)
          defaultHolder.replace(this.slot.el)
      } catch (e) {
        throw new Error(`parse Compontent[${this.expr}] Slots failed: ${e.message}`)
      }
    }
  },
  executeExpr(expr) {
    if (!expr) return null
    let ctx = this.context()
    return expr.executeAll(ctx, [ctx, this.el, this])
  },
  bind() {
    this.bindExpr(this.scopeExpr, this.scopeHandler)
    this.bindExpr(this.propsExpr, this.propsHandler)
    this.controller.bind()
    if (this.slot)
      this.slot.bind()
  },
  unbind() {
    this.unbindExpr(this.scopeExpr, this.scopeHandler)
    this.unbindExpr(this.propsExpr, this.propsHandler)
    this.controller.unbind()
    if (this.slot)
      this.unslot.bind()
  },
  bindExpr(expr, handler) {
    if (expr)
      each(expr.identities, (ident) => {
        this.observe(ident, handler)
      })
  },
  unbindExpr(expr, handler) {
    if (expr)
      each(expr.identities, (ident) => {
        this.unobserve(ident, handler)
      })
  },
  scopeHandler(expr, target) {
    this.controller.scope = this.exprChangeValue(this.scopeExpr, target)
  },
  propsHandler() {
    this.controller.props = this.exprChangeValue(this.propsExpr, target)
  },
  exprChangeValue(expr, value) {
    if (expr.isSimple()) {
      var ctx = this.context()
      value = expr.executeFilter(ctx, [ctx, this.el, this], value)
    } else {
      value = this.executeExpr(expr)
    }
    return proxy(value)
  }
})

export const HolderDirective = Directive.register('holder', {
  type: 'empty-block',
  alone: true,
  constructor() {
    this.super(arguments)
    let r = this.root,
      holders = r.holders || (r.holders = {}),
      name = this.name = this.expr || 'default'
    if (holders[name])
      throw new Error(`Multi-Defined Holder[${name}]`)
    holders[name] = this
    this.mask = document.createComment(`Holder[${this.expr}]`)
    dom.replace(this.el, this.mask)
    this.el = undefined
  },
  replace(el) {
    dom.after(el, this.mask)
  },
  bind() {},
  unbind() {}
})

export const SlotDirective = Directive.register('slot', {
  type: 'inline-template',
  alone: true,
  constructor() {
    this.super(arguments)
    let holders = this.ctx.holders,
      name = this.name = this.expr || 'default',
      holder = holders[name]
    if (holder) {
      var collector = this.collector = this.ctx.clone(this.templateParser)
      holder.replace(collector.el)
      holder.bindSlot = true
    } else {
      throw new Error(`Holder[${name}] is undefined`)
    }
  },
  bind() {
    this.collector.bind()
  },
  unbind() {
    this.collector.unbind()
  }
})

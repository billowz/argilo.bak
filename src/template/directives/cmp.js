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
Controller.mixin('cmps', undefined)
Controller.mixin('holders', undefined)

export const CompontentDirective = Directive.register('cmp', {
  params: ['props'],
  type: 'inline-template',
  priority: 8,
  constructor() {
    this.super(arguments)
    this.propsHandler = this.propsHandler.bind(this)
    this.compontent = getCompontent(this.expr)
    if (!this.compontent)
      throw new Error(`Compontent[${this.expr}] is not defined`)
    let {
      props
    } = this.params
    this.propsExpr = props && expression(props, expressionArgs, expressionParser)
    this.propsExprArgs = [this.proxy, this.el, this]
    this.props = this.propsExpr && this.getProps()

    let ct = this.controller = this.compontent.compile(this.props || {}),
      $el = ct.$el
    this.mask = document.createComment(`Compontent[${this.expr}]`)
    dom.replace(this.el, this.mask)
    dom.after($el, this.mask)
    this.group.updateEl(isArrayLike($el) ? $el[0] : $el, this)
    this.el = undefined

    let r = this.root = findRoot(this.ctx)
    let cmps = r.cmps
    if (!cmps) {
      r.cmps = [ct]
    } else {
      cmps.push(ct)
    }
    this.initSlot()
  },
  initSlot() {
    let holders = this.controller.holders,
      defaultHolder
    if (holders) {
      defaultHolder = holders['default']
      try {
        this.slot = this.proxy.clone(this.templateParser, {
          holders
        })
        if (defaultHolder && !defaultHolder.bindSlot)
          defaultHolder.replace(this.slot.$el)
      } catch (e) {
        console.log(e)
        throw new Error(`parse Compontent[${this.expr}] Slots failed: ${e.message}`)
      }
    }
  },
  getProps() {
    return this.propsExpr.executeAll(this.proxy, this.propsExprArgs)
  },
  bind() {
    if (this.propsExpr)
      each(this.propsExpr.identities, (ident) => {
        this.observe(ident, this.propsHandler)
      })
    this.controller.bind()
    if (this.slot)
      this.slot.bind()
  },
  unbind() {
    if (this.propsExpr)
      each(this.propsExpr.identities, (ident) => {
        this.unobserve(ident, this.propsHandler)
      })
    this.controller.unbind()
    if (this.slot)
      this.unslot.bind()
  },
  propsHandler(expr, value) {
    var oldProps = this.props,
      props = this.propsExpr.isSimple() ? expr.filter(this.proxy, this.propsExprArgs, value) : this.getProps(),
      ct = this.controller
    this.props = props
    each(oldProps, (v, name) => {
      if (!(name in props))
        props[name] = undefined
    })
    each(props, (v, name) => {
      ct[name] = v
    })
  }
})

export const HolderDirective = Directive.register('holder', {
  type: 'empty-block',
  alone: true,
  constructor() {
    this.super(arguments)
    let r = this.root = findRoot(this.ctx),
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
      this.controller = this.proxy.clone(this.templateParser)
      holder.replace(this.controller.$el)
      holder.bindSlot = true
    } else {
      throw new Error(`Holder[${name}] is undefined`)
    }
  },
  bind() {
    this.controller.bind()
  },
  unbind() {
    this.controller.unbind()
  }
})

function findRoot(ctx) {
  let p
  while (p = ctx.$parent) {
    ctx = p
  }
  return ctx
}

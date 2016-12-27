import {
  Directive
} from '../binding'
import {
  Controller
} from '../Controller'
import {
  CompontentDirective
} from './cmp'
import logger from '../log'
import {
  each,
  isArray
} from 'ilos'

Controller.mixin('refs', undefined, () => {
  return {}
})
export const RefrenceDirective = Directive.register('ref', {
  constructor() {
    this.super(arguments)
    this.index = 0
    each(this.group.directives, directive => {
      if (directive != this) {
        this.cmpDirective = directive
        return false
      }
    })
    let refs = this.ctx.refs,
      name = this.expr,
      val = refs[name],
      ref = this.getRef()
    if (!val) {
      refs[name] = ref
    } else if (isArray(val)) {
      val.push(ref)
      this.index = val.length - 1
    } else {
      refs[name] = [val, ref]
      this.index = 1
    }
  },
  updateEl(el) {
    this.super(arguments)
    this.updateRef()
  },
  updateRef() {
    let name = this.expr,
      refs = this.ctx.refs,
      val = refs[name],
      ref = this.getRef()
    if (isArray(val)) {
      val[this.index] = ref
    } else {
      this.refs[name] = ref
    }
  },
  getRef() {
    return (this.cmpDirective && this.cmpDirective.controller) || this.el
  },
  bind() {},
  unbind() {}
})

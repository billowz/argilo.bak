import Binding from './Binding'
import {
  YieId
} from '../util'
import {
  createClass,
  each,
  map,
  assign
} from 'ilos'

export default createClass({
  constructor(cfg) {
    let {
      el,
      context,
      Collector
    } = cfg,
    directives = this.directives = []

    this.el = el
    this.children = cfg.children
    this.bindedCount = 0
    this.bindedChildren = false
    this.directiveCount = cfg.directives.length
    each(cfg.directives, directive => {
      directives.push(new directive.constructor(assign({
        el: this.el,
        context,
        Collector,
        group: this
      }, directive.params)))
    })
    this.el = undefined
  },
  updateEl(el, target) {
    if (this.el)
      this.el = el
    each(this.directives, directive => {
      if (target != directive)
        directive.updateEl(el)
    })
  },
  bind() {
    let idx = this.bindedCount
    if (idx < this.directiveCount) {
      let directive = this.directives[idx],
        ret = directive.bind()
      this.bindedCount++;
      (ret && ret instanceof YieId) ? ret.then(() => {
        this.bind()
      }): this.bind()
    } else if (this.children && !this.bindedChildren) {
      each(this.children, (child) => {
        child.bind()
      })
      this.bindedChildren = true
    }
  },
  unbind() {
    let directives = this.directives,
      i = this.bindedCount

    if (this.bindedChildren) {
      each(this.children, (child) => {
        child.unbind()
      })
      this.bindedChildren = false
    }
    while (i--) {
      directives[i].unbind()
    }
    this.bindedCount = 0
  }
})

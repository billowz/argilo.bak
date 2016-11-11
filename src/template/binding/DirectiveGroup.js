import Binding from './Binding'
import {
  YieId
} from '../util'
import {
  dynamicClass,
  each
} from 'ilos'

export default dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.children = cfg.children
    this.bindedCount = 0
    this.bindedChildren = false
    this.directives = directives
    this.directiveCount = directives.length
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

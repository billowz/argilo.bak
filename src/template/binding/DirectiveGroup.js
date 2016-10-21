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
    this._bind = this._bind.bind(this)
  },
  _setDirectives(directives) {
    this.directives = directives
    this.directiveCount = directives.length
  },
  _bind() {
    let idx = this.bindedCount
    if (idx < this.directiveCount) {
      let directive = this.directives[idx],
        ret = directive.bind()
      this.bindedCount++;
      (ret && ret instanceof YieId) ? ret.then(this._bind): this._bind()
    } else if (this.children) {
      each(this.children, (directive) => {
        directive.bind()
      })
      this.bindedChildren = true
    }
  },
  bind() {
    this._bind()
  },
  unbind() {
    let directives = this.directives,
      i = this.bindedCount

    if (this.bindedChildren) {
      each(this.children, (directive) => {
        directive.unbind()
      })
      this.bindedChildren = false
    }
    while (i--) {
      directives[i].unbind()
    }
    this.bindedCount = 0
  }
})

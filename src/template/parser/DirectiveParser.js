import {
  Directive
} from '../binding'
import configuration from '../configuration'
import {
  createClass,
  isRegExp
} from 'ilos'

export default createClass({
  constructor(reg) {
    this.reg = reg
  },
  isDirective(attr) {
    return this.reg.test(attr)
  },
  getDirective(attr) {
    return Directive.getDirective(attr.replace(this.reg, ''))
  }
})

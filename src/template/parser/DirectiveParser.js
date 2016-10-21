import {
  Directive
} from '../binding'
import configuration from '../configuration'
import {
  dynamicClass,
  isRegExp
} from 'ilos'

export default dynamicClass({
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

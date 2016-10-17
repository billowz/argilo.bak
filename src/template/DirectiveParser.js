import {
  Directive
} from '../binding'
import _ from 'ilos'
import configuration from '../configuration'

configuration.register('directiveReg', /^ag-/)
const cfg = configuration.get()

export default _.dynamicClass({
  constructor() {
    this.reg = cfg.directiveReg
  },
  isDirective(attr) {
    return this.reg.test(attr)
  },
  getDirective(attr) {
    return Directive.getDirective(attr.replace(this.reg, ''))
  }
})

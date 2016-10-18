import {
  Directive
} from '../binding'
import _ from 'ilos'
import configuration from '../configuration'

let directiveReg = /^ag-/
configuration.register('directiveReg', directiveReg, 'init', (reg) => {
  if (!_.isRegExp(reg))
    throw new Error('Invalid Directive RegExp: ' + reg)
  directiveReg = reg
  return true
})

export default _.dynamicClass({
  isDirective(attr) {
    return directiveReg.test(attr)
  },
  getDirective(attr) {
    return Directive.getDirective(attr.replace(directiveReg, ''))
  }
})

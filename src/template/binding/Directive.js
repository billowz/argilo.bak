import Binding from './Binding'
import dom from '../../dom'
import configuration from '../configuration'
import logger from '../log'
import {
  dynamicClass,
  each,
  isFunc,
  isObject,
  isExtendOf
} from 'ilos'
const directives = {}

const Directive = dynamicClass({
  extend: Binding,
  independent: false,
  block: false,
  priority: 5,
  constructor(cfg) {
    this.super(arguments)
    this.expr = cfg.expression
    this.attr = cfg.attr
    this.templateParser = cfg.templateParser
    if (Binding.comments) {
      this.comment = document.createComment(`Directive[${this.attr}]: ${this.expr}`)
      dom.before(this.comment, this.el)
    }
  },
  statics: {
    getPriority(directive) {
      return directive.prototype.priority
    },
    isBlock(directive) {
      return directive.prototype.block
    },
    isIndependent(directive) {
      return directive.prototype.independent
    },
    getDirective(name) {
      return directives[name.toLowerCase()]
    },
    isDirective(obj) {
      return isExtendOf(obj, Directive)
    },
    register(name, option) {
      let directive

      name = name.toLowerCase()

      if (isObject(option)) {
        option.extend = option.extend || Directive
        directive = dynamicClass(option)
      } else if (isFunc(option) && isExtendOf(option, Directive)) {
        directive = option
      } else {
        throw TypeError(`Invalid Directive[${name}] ${option}`)
      }

      if (name in directives)
        throw new Error(`Directive[${name}] is existing`)

      directives[name] = directive
      logger.debug('register Directive[%s]', name)
      return directive
    }
  }
})
export default Directive
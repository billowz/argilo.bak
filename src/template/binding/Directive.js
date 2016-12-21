import Binding from './Binding'
import dom from '../../dom'
import configuration from '../configuration'
import logger from '../log'
import {
  createClass,
  each,
  isFunc,
  isObject,
  isExtendOf
} from 'ilos'
const directives = {}

const Directive = createClass({
  extend: Binding,
  type: 'normal',
  alone: false,
  priority: 5,
  constructor(cfg) {
    this.super(arguments)
    this.Collector = cfg.Collector
    this.expr = cfg.expression
    this.attr = cfg.attr
    this.params = cfg.params
    this.templateParser = cfg.templateParser
    this.group = cfg.group
    if (Binding.comments) {
      this.comment = document.createComment(`Directive[${this.attr}]: ${this.expr}`)
      dom.before(this.comment, this.el)
    }
  },
  updateEl(el) {
    this.el = el
  },
  statics: {
    getPriority(directive) {
      return directive.prototype.priority
    },
    getType(directive) {
      return directive.prototype.type
    },
    isAlone(directive) {
      return directive.prototype.alone
    },
    getParams(directive) {
      return directive.prototype.params
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
        directive = createClass(option)
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

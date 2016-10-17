import Binding from './Binding'
import _ from 'ilos'
import dom from '../dom'
import configuration from '../configuration'
import logger from '../log'

const directives = {}

const Directive = _.dynamicClass({
  extend: Binding,
  independent: false,
  block: false,
  priority: 5,
  constructor(cfg) {
    this.super(arguments)
    this.expr = cfg.expression
    this.attr = cfg.attr
    this.children = cfg.children
    this.domParser = cfg.domParser
    this.group = cfg.group
    if (configuration.get(Binding.commentCfg)) {
      this.comment = document.createComment(`Directive[${this.attr}]: ${this.expr}`)
      dom.before(this.comment, this.el)
    }
  },
  bindChildren() {
    if (this.children)
      _.each(this.children, (directive) => {
        directive.bind()
      })
  },
  bind() {
    this.bindChildren()
  },
  unbindChildren() {
    if (this.children)
      _.each(this.children, (directive) => {
        directive.unbind()
      })
  },
  unbind() {
    this.unbindChildren()
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
      return _.isExtendOf(obj, Directive)
    },
    register(name, option) {
      let directive

      name = name.toLowerCase()

      if (_.isObject(option)) {
        option.extend = option.extend || Directive
        directive = _.dynamicClass(option)
      } else if (_.isFunc(option) && _.isExtendOf(option, Directive)) {
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

import dom from '../dom'
import {
  proxy,
  obj,
  createProxy
} from 'observi'
import {
  createClass,
  each,
  map,
  isFunc,
  reverseConvert,
  assign,
  create,
  clone
} from 'ilos'
import logger from './log'

const handler = function() {}

function parseBindings(bindings, Collector, context) {
  return map(bindings, binding => {
    let {
      el,
      directives,
      children
    } = binding,
    params = assign({
      el,
      context,
      Collector
    }, binding.params)

    if (directives)
      params.directives = map(directives, directive => {
        return {
          constructor: directive.constructor,
          params: directive.params
        }
      })
    if (children)
      params.children = parseBindings(children, Collector, context)
    return new binding.constructor(params)
  })
}

function toDocument(collector, target, bind, fireEvent, fn) {
  fireEvent = fireEvent !== false
  if (fireEvent && collector.$isMounted) {
    collector.unmouting()
    collector.unmounted()
  }
  fireEvent && collector.mouting()
  if (bind !== false)
    collector.bind(fireEvent)
  fn.call(collector, target)
  collector.$isMounted = true
  fireEvent && collector.mounted()
}
const mixins = {}
export const Controller = createClass({
  $parent: undefined, // parent collector(collector is clone from parent collector)
  $props: undefined, // prop defines
  statics: {
    mixin(name, protoValue, valueConsumer) {
      if (arguments.length == 1) {
        each(name, (mixin, name) => {
          Controller.mixin(name, mixin.proto, mixin.consumer)
        })
      } else {
        var proto = Controller.prototype
        if (name in proto)
          logger.warn('Re-mixin Controller Property[%s]', name)
        proto[name] = protoValue
        if (isFunc(valueConsumer))
          mixins[name] = valueConsumer
      }
    },
    newInstance(Class, templateParser, props) {


      let frame = document.createDocumentFragment(),
        inst = createProxy(new Class(Class, props)),
        {
          el,
          bindings
        } = templateParser.clone()
      dom.append(frame, el)
      inst.$bindings = parseBindings(bindings, Controller, inst)
      inst.$el = map(frame.childNodes, el => el)
      inst.created()
      return inst
    }
  },
  constructor(Controller, props = {}) {
    this.$class = Controller
    this.$isMounted = this.$isBinded = false
    each(mixins, (consumer, name) => {
      this[name] = consumer.call(this, this)
    })
    this.init(props)
    this.$bindings = undefined
    this.$el = undefined
  },
  init(props) {
    each(props, (descriptor, name) => {
      this[name] = props[name]
    })
  },
  clone(templateParser, props, beforeParseBinding) {
    let clone = create(obj(this)),
      frame = document.createDocumentFragment(),
      {
        el,
        bindings
      } = templateParser.clone()

    dom.append(frame, el)
    clone.$bindings = clone.$el = undefined
    clone.$isMounted = clone.$isBinded = false
    clone.$parent = this

    if (props)
      each(props, (val, name) => {
        clone[name] = val
      })
    if (isFunc(beforeParseBinding))
      beforeParseBinding(clone)

    clone = createProxy(clone)
    clone.$bindings = parseBindings(bindings, this.$class, clone)
    clone.$el = map(frame.childNodes, el => el)
    return clone
  },
  before(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.before(this.$el, dom.query(target))
    })
    return this
  },
  after(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.after(this.$el, dom.query(target))
    })
    return this
  },
  prependTo(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.prepend(dom.query(target), this.$el)
    })
    return this
  },
  appendTo(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.append(dom.query(target), this.$el)
    })
    return this
  },
  remove(unbind, fireEvent) {
    fireEvent = fireEvent !== false
    let fireUnmount = fireEvent && this.$isMounted,
      needUnbind = unbind !== false,
      fireRemove = fireEvent && (needUnbind ? fireUnmount || this.$isBinded : fireUnmount && !this.$isBinded)
    if (fireRemove)
      this.removing()

    if (fireUnmount) this.unmounting()
    dom.remove(this.$el)
    this.$isMounted = false
    if (fireUnmount) this.unmounted()

    if (needUnbind)
      this.unbind(fireEvent)

    if (fireRemove)
      this.removed()
    return this
  },
  bind(fireEvent) {
    if (!this.$isBinded) {
      fireEvent = fireEvent !== false
      fireEvent && this.binding()
      each(this.$bindings, (bind) => {
        bind.bind()
      })
      this.$isBinded = true
      fireEvent && this.binded()
    }
    return this
  },
  unbind(fireEvent) {
    if (this.$isBinded) {
      fireEvent = fireEvent !== false
      fireEvent && this.unbinding()
      each(this.$bindings, (bind) => {
        bind.unbind()
      })
      this.$isBinded = false
      fireEvent && this.unbinded()
    }
    return this
  },
  created: handler,
  mouting: handler,
  mounted: handler,
  unmounting: handler,
  unmounted: handler,
  binding: handler,
  unbinding: handler,
  binded: handler,
  unbinded: handler,
  removing: handler,
  removed: handler
})

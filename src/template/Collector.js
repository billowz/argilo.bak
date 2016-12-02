import dom from '../dom'
import {
  proxy
} from 'observi'
import {
  dynamicClass,
  each,
  map,
  isFunc,
  reverseConvert,
  assign,
  create,
  clone
} from 'ilos'

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
        return new directive.constructor(assign({
          el,
          context,
          Collector
        }, directive.params))
      })
    if (children)
      params.children = parseBindings(children, Collector, context)
    return new binding.constructor(params)
  })
}

function toDocument(collector, target, bind, fireEvent, fn) {
  fireEvent = fireEvent !== false
  if (fireEvent && collector.isMounted) {
    collector.unmouting()
    collector.unmounted()
  }
  fireEvent && collector.mouting()
  if (bind !== false)
    collector.bind(fireEvent)
  fn.call(collector, target)
  collector.isMounted = true
  fireEvent && collector.mounted()
}

export default dynamicClass({
  $parent: null,
  constructor(Collector, templateParser, scope = {}, props = {}) {
    let {
      el,
      bindings
    } = templateParser.clone()
    this.$watchs = {
      props: true,
      scope: true,
      state: true
    }
    this.state = (this.state && clone(this.state)) || {}
    this.scope = proxy(scope)
    this.props = proxy(props)
    dom.append(document.createDocumentFragment(), el)
    this.el = el
    this.isMounted = this.isBinded = false
    this.bindings = parseBindings(bindings, Collector, this)
    this.Collector = Collector
    this.created()
  },
  clone(templateParser) {
    let clone = create(this),
      {
        el,
        bindings
      } = templateParser.clone()
    dom.append(document.createDocumentFragment(), el)
    clone.el = el
    clone.isMounted = clone.isBinded = false
    clone.bindings = parseBindings(bindings, this.Collector, clone)
    clone.$parent = this
    clone.$watchs = assign({}, this.$watchs)
    return clone
  },
  before(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.before(this.el, dom.query(target))
    })
    return this
  },
  after(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.after(this.el, dom.query(target))
    })
    return this
  },
  prependTo(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.prepend(dom.query(target), this.el)
    })
    return this
  },
  appendTo(target, bind, fireEvent) {
    toDocument(this, target, bind, fireEvent, (target) => {
      dom.append(dom.query(target), this.el)
    })
    return this
  },
  remove(unbind, fireEvent) {
    fireEvent = fireEvent !== false
    let fireUnmount = fireEvent && this.isMounted,
      needUnbind = unbind !== false,
      fireRemove = fireEvent && (needUnbind ? fireUnmount || this.isBinded : fireUnmount && !this.isBinded)
    if (fireRemove)
      this.removing()

    if (fireUnmount) this.unmounting()
    dom.remove(this.el)
    this.isMounted = false
    if (fireUnmount) this.unmounted()

    if (needUnbind)
      this.unbind(fireEvent)

    if (fireRemove)
      this.removed()
    return this
  },
  bind(fireEvent) {
    if (!this.isBinded) {
      fireEvent = fireEvent !== false
      fireEvent && this.binding()
      each(this.bindings, (bind) => {
        bind.bind()
      })
      this.isBinded = true
      fireEvent && this.binded()
    }
    return this
  },
  unbind(fireEvent) {
    if (this.isBinded) {
      fireEvent = fireEvent !== false
      fireEvent && this.unbinding()
      each(this.bindings, (bind) => {
        bind.unbind()
      })
      this.isBinded = false
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

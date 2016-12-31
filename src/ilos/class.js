import {
  isFunc
} from './is'
import {
  each
} from './collection'
import {
  prototypeOf,
  setPrototypeOf,
  create,
  assign,
  assignIf
} from './object'

export function isExtendOf(cls, parent) {
  if (!isFunc(cls))
    return (cls instanceof parent)

  let proto = cls

  while ((proto = prototypeOf(proto)) && proto !== Object) {
    if (proto === parent)
      return true
  }
  return parent === Object
}

export function Base() {

}
const emptyArray = []
assign(Base.prototype, {
  super(args) {
    let method = arguments.callee.caller
    return method.$owner.superclass.prototype[method.$name].apply(this, args || emptyArray)
  },
  superclass() {
    let method = arguments.callee.caller
    return method.$owner.superclass
  }
})

assign(Base, {
  extend(overrides) {
    if (overrides) {
      var proto = this.prototype
      this.assign(overrides.statics)
      delete overrides.statics
      each(overrides, (member, name) => {
        if (isFunc(member)) {
          member.$owner = this
          member.$name = name
        }
        proto[name] = member
      })
    }
    return this
  },
  assign(statics) {
    if (statics)
      assign(this, statics)
    return this
  }
})

export function createClass(overrides) {
  let superclass = overrides.extend,
    superproto,
    proto

  function DynamicClass() {
    this.constructor.apply(this, arguments)
  }
  assign(DynamicClass, Base)

  if (!isFunc(superclass) || superclass === Object)
    superclass = Base

  superproto = superclass.prototype

  proto = create(superproto)

  DynamicClass.superclass = superclass
  DynamicClass.prototype = proto
  setPrototypeOf(DynamicClass, superclass)

  delete overrides.extend
  return DynamicClass.extend(overrides)
}

export function mixin(cls) {
  let args = arguments.slice()
  args[0] = cls.prototype
  assignIf.apply(null, args)
  return cls
}

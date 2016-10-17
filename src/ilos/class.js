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
    method.$owner.superclass[method.$name].apply(this, args || emptyArray)
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
      each(overrides, (member, name) => {
        if (isFunc(member)) {
          member.$owner = this
          member.$name = name
        }
        proto[name] = member
      })
      this.assign(overrides.statics)
    }
    return this
  },
  assign(statics) {
    if (statics)
      assign(this, statics)
    return this
  }
})

export function dynamicClass(overrides) {
  let cls = function DynamicClass() {
      this.constructor.apply(this, arguments)
    },
    superclass = overrides.extend,
    superproto,
    proto

  assign(cls, Base)

  if (!isFunc(superclass) || superclass === Object)
    superclass = Base

  superproto = superclass.prototype

  proto = create(superproto)

  cls.superclass = superproto
  cls.prototype = proto
  setPrototypeOf(cls, superclass)

  delete overrides.extend
  return cls.extend(overrides)
}

export function mixin(cls) {
  let args = arguments.slice()
  args[0] = cls.prototype
  assignIf.apply(null, args)
  return cls
}

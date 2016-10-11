const hasOwn = Object.prototype.hasOwnProperty,
  policies = {
    hasOwn(obj, prop) {
      return hasOwn.call(obj, prop)
    },
    eq(o1, o2) {
      return o1 === o2
    }
  }

export function policy(name, policy) {
  return arguments.length == 1 ? policies[name] : (policies[name] = policy)
}

export function eq(o1, o2) {
  return policies.eq(o1, o2)
}

export function hasOwnProp(o1, o2) {
  return policies.hasOwn(o1, o2)
}

export function emptyFunc() {}

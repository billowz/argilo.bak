const FuncProto = Function.prototype,
  slice = Array.prototype.slice

if (!FuncProto.bind) {
  FuncProto.bind = function bind(scope) {
    let fn = this
    if (arguments.length > 1) {
      var args = slice.call(arguments, 1)
      return function() {
        return fn.apply(scope, args.concat(slice.call(arguments)))
      }
    }
    return function() {
      return fn.apply(scope, arguments)
    }
  }
}

if (!Object.freeze) {
  Object.freeze = function freeze(obj) {
    return obj
  }
}

import {
  dynamicClass
} from './class'

function fn(name) {
  return function() {
    throw new Error('execute abstract method[' + name + ']')
  }
}

export default dynamicClass({
  hasConfig: fn('hasConfig'),
  config: fn('config'),
  get: fn('get'),
  each: fn('each')
})

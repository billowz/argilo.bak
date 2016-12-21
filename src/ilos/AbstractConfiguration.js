import {
  createClass
} from './class'

function fn(name) {
  return function() {
    throw new Error('execute abstract method[' + name + ']')
  }
}

export default createClass({
  hasConfig: fn('hasConfig'),
  config: fn('config'),
  get: fn('get'),
  each: fn('each')
})

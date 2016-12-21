import {
  createClass
} from 'ilos'

const regHump = /^[a-z]|[_-]+[a-zA-Z]/g

function _hump(k) {
  return k.charAt(k.length - 1).toUpperCase()
}

export function hump(str) {
  return str.replace(regHump, _hump)
}

export const YieId = createClass({
  constructor() {
    this.doned = false
    this.thens = []
  },
  then(callback) {
    if (this.doned)
      callback()
    else
      this.thens.push(callback)
  },
  done() {
    if (!this.doned) {
      this.doned = true
      let thens = this.thens;
      for (let i = 0, l = thens.length; i < l; i++) {
        thens[i]()
      }
    }
  },
  isDone() {
    return this.doned
  }
})

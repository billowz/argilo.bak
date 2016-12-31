import {
  Configuration
} from 'ilos'

const keyReg = /^key\./
const _keys = [],
  keymap = {}

export const configuration = new Configuration(['init', 'runtime'], (status, configuration) => {
  if (status == 'runtime') {
    configuration.each((val, name) => {
      if (keyReg.test(name)) {
        _keys.push(val)
        keymap[val] = true
      }
    })
  }
})

export function keys() {
  return _keys
}

export function hasKey(name) {
  return keymap[name]
}

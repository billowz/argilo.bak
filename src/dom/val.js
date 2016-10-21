import dom from './core'
import {
  assign,
  keys,
  reverseConvert,
  isNil,
  isBool,
  isString,
  isArray
} from 'ilos'

function stringValue(val) {
  if (isNil(val) || val === NaN)
    return ''
  if (!isString(val))
    return val + ''
  return val
}

export default assign(dom, {
  val(el, val) {
    let hook = dom.valHooks[el.type || el.tagName.toLowerCase()]

    if (arguments.length == 1)
      return hook && hook.get ? hook.get(el) : el.value || ''

    if (hook && hook.set) {
      hook.set(el, val)
    } else {
      el.value = stringValue(val)
    }
    return dom
  },
  valHooks: {
    option: {
      get(el) {
        let val = el.attributes.value

        return !val || val.specified ? el.value : el.text
      }
    },

    select: {
      get(el) {
        let signle = el.type == 'select-one',
          index = el.selectedIndex

        if (index < 0)
          return signle ? undefined : []

        let options = el.options,
          option,
          values = signle ? undefined : []

        for (let i = 0, l = options.length; i < l; i++) {
          option = options[i];
          if (option.selected || i == index) {
            if (signle) return dom.val(option);
            values.push(dom.val(option))
          }
        }
        return values
      },

      set(el, value) {
        let signle = el.type == 'select-one',
          options = el.options,
          option, i, l, vl, val

        el.selectedIndex = -1;

        if (!isArray(value))
          value = isNil(value) ? [] : [value]

        if ((vl = value.length)) {
          if (signle) vl = value.length = 1

          let map = reverseConvert(value, () => false),
            nr = 0

          for (i = 0, l = options.length; i < l; i++) {
            option = options[i]
            val = dom.val(option)
            if (isBool(map[val])) {
              map[val] = option.selected = true
              if (++nr === vl)
                break
            }
            value = keys(map, (v) => v === true)
          }
        }
        return signle ? value[0] : value
      }
    }
  }
})

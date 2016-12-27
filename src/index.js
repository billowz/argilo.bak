import * as template from './template'
import dom from './dom'
import * as observi from 'observi'
import * as _ from 'ilos'

const {
  Compontent
} = template, {
  assignIf
} = _

export default function argilo(name, options) {
  if (arguments.length == 1) {
    options = name
  } else {
    options.name = name
  }
  return new Compontent(options)
}
assignIf(argilo, template, observi, _, dom)

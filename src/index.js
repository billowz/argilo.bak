import * as template from './template'
import dom from './dom'
import * as observi from 'observi'
import * as _ from 'ilos'

const {
  Template
} = template, {
  assignIf
} = _

export default function argilo(cfg) {
  return new Template(cfg)
}
assignIf(argilo, template, observi, _, dom)

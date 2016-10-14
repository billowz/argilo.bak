import _ from 'ilos'
import observi from 'observi'

const argilo = {
  observe: observi.on,
  unobserve: observi.un
}


export default _.assignIf(_.create(argilo), {
  argilo: argilo,
  observi: observi,
  ilos: _
}, observi.observi, _)

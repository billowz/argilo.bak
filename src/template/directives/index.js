import EachDirective from './each'
import event from './event'
import exprs from './exprs'
import {
  CompontentDirective
} from './cmp'
import {
  RefrenceDirective
} from './ref'
import {
  assign
} from 'ilos'
export default assign({
  EachDirective,
  CompontentDirective,
  RefrenceDirective
}, event, exprs)

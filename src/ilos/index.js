import './polyfill'
import * as common from './common'
import * as is from './is'
import * as coll from './collection'
import * as obj from './object'
import * as string from './string'
import * as cls from './class'
import LinkedList from './LinkedList'
import Configuration from './Configuration'
import Logger from './Logger'

export default obj.assign({
  LinkedList,
  Configuration
}, common, is, coll, obj, string, cls)

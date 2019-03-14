/**
 * prototype utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Mar 14 2019 09:20:31 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

export { prototypeOf, protoProp, protoOf, __setProto, setProto } from './polyfill'

/*#else

export { prototypeOf, protoProp, protoOf, __setProto, setProto } from './main'

//#endif */

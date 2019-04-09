/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:27:56 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

export { prototypeOf, protoProp, protoOf, __setProto, setProto } from './polyfill'

/*#else

export { prototypeOf, protoProp, protoOf, __setProto, setProto } from './main'

//#endif */

/**
 * property utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Mar 14 2019 09:21:12 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

export { propDescriptor, propAccessor, defProp, defPropValue } from './polyfill'

/*#else

export { propDescriptor, propAccessor, defProp, defPropValue } from './main'

//#endif */

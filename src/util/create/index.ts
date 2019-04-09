/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:11:29 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

export { create } from './polyfill'

/*#else

export { create } from './main'

//#endif */

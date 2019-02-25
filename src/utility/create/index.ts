/**
 * @module utility/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:15:42 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

export { create } from './polyfill'

/*#else

export { create } from './main'

//#endif */

/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Mar 01 2019 18:17:27 GMT+0800 (China Standard Time)
 * @modified Thu Mar 28 2019 19:40:22 GMT+0800 (China Standard Time)
 */

export * from './IObserver'
export * from './Observer'

//#if _TARGET === 'es3'
export { VBPROXY_KEY, VBPROXY_CTOR_KEY } from './VBPolicy'
//#endif

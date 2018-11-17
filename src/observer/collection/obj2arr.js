// @flow
/**
 * @module observer/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Jul 26 2018 10:47:47 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:45:10 GMT+0800 (China Standard Time)
 */

import { $eachArray, $eachObj, $eachProps } from './each'
import { mkObjKeys, mkIdxOfArray, keys, values } from '../../helper'

/**
 * @function
 * @see {keys}
 */
export const $keys: typeof keys = mkObjKeys($eachProps)

/**
 * @function
 * @see {values}
 */
export const $values: typeof values = mkObjValues($eachObj)

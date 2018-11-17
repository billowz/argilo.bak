// @flow
/**
 * @module observer/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 19:20:38 GMT+0800 (China Standard Time)
 */

import { $eachArray, $eachObj } from './each'
import { mkReduceObj, mkReduceArray, mkReduce, reduceObj, reduceArray, rreduceArray, reduce } from '../../helper'

/**
 * @function
 * @see {reduce}
 */
export const $reduceObj: typeof reduceObj = mkReduceObj($eachObj)

/**
 * @function
 * @see {reduce}
 */
export const $reduceArray: typeof reduceArray = mkReduceArray($eachArray)

/**
 * @function
 * @see {reduce}
 */
export const $rreduceArray: typeof reduceArray = mkReduceArray($reachArray)

/**
 * @function
 * @see {reduce}
 */
export const $reduce: typeof reduce = mkReduce($reduceArray, $reduceObj)

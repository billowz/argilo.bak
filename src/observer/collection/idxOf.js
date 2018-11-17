// @flow
/**
 * @module helper/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:45:26 GMT+0800 (China Standard Time)
 */

import { $eachArray, $eachObj } from './each'
import { mkIdxOfObj, mkIdxOfArray, mkIdxOf, idxOfObj, idxOfArray, ridxOfArray, idxOf } from '../../helper'

/**
 * @function
 * @see {idxOfObj}
 */
export const $idxOfObj: typeof idxOfObj = mkIdxOfObj($eachObj)

/**
 * @function
 * @see {idxOfArray}
 */
export const $idxOfArray: typeof idxOfArray = mkIdxOfArray($eachArray)

/**
 * @function
 * @see {ridxOfArray}
 */
export const $ridxOfArray: typeof ridxOfArray = mkIdxOfArray($reachArray)

/**
 * @function
 * @see {ridxOfArray}
 */
export const $idxOf: typeof idxOf = mkIdxOf($idxOfArray, $idxOfObj)

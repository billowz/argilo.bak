// @flow
/**
 * @module observer/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:45:20 GMT+0800 (China Standard Time)
 */

import { $eachArray, $eachObj } from './each'
import { mkMapObj, mkMapArray, mkMap, mapObj, mapArray, rmapArray, map } from '../../helper'


/**
 * @function
 * @see {mapObj}
 */
export const $mapObj: typeof mapObj = mkMapObj($eachObj)

/**
 * @function
 * @see {mapArray}
 */
export const $mapArray: typeof mapArray = mkMapArray($eachArray)

/**
 * @function
 * @see {rmapArray}
 */
export const $rmapArray: typeof rmapArray = mkMapArray($reachArray)

/**
 * @function
 * @see {map}
 */
export const $map: typeof map = mkMap($mapArray, $mapObj)

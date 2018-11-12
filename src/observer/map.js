/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:59
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:59
 */
import { $each, $eachArray, $eachObj } from './each'
import { mapStr, __mkMapArrayLike, __mkMapObj } from '../helper/map'
import { __mkEach } from '../helper/each'

export const $mapArray = __mkMapArrayLike($eachArray),
	$mapObj = __mkMapObj($eachObj),
	$map = __mkEach(mapStr, $mapArray, $mapObj)

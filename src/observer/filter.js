/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:40
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:40
 */
import { $map, $mapArray, $mapObj } from './map'
import { mapStr, __mkMapArrayLike, __mkMapObj } from '../helper/map'
import { __mkFilter } from '../helper/filter'

export const $filterArray = __mkFilter($mapArray),
	$filterObj = __mkFilter($mapObj),
	$filter = __mkFilter($map)

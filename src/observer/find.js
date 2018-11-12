/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:50
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:50
 */
import { $each, $eachArray, $eachObj, $reach, $reachArray } from './each'
import { __mkFind } from '../helper/find'

export const $findArray = __mkFind($eachArray),
	$findObj = __mkFind($eachObj),
	$find = __mkFind($each),
	$rfindArray = __mkFind($reachArray),
	$rfind = __mkFind($reach)

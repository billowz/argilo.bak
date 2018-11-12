/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:55
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:55
 */
import { $eachArray, $eachObj, $reachArray } from './each'
import { __mkIndexOf, __mkTypeIndexOf } from '../helper/indexOf'

export const $indexOfArray = __mkTypeIndexOf($eachArray),
	$indexOfObj = __mkTypeIndexOf($eachObj),
	$lastIndexOfArray = __mkTypeIndexOf($reachArray),
	$indexOf = __mkIndexOf($indexOfArray, 'indexOf'),
	$lastIndexOf = __mkIndexOf($lastIndexOfArray, 'lastIndexOf')

/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 19:54:12
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-27 15:26:30
 */
import EventDirective from './EventDirective'
import { registerDirective } from '../../vnode'
import { array2obj, map, upperFirst, isStr } from '../../helper'

export default array2obj(
	map(
		[
			'blur',
			'change',
			'click',
			'dblclick',
			'error',
			'focus',
			'keydown',
			'keypress',
			'keyup',
			'load',
			'mousedown',
			'mousemove',
			'mouseout',
			'mouseover',
			'mouseup',
			'resize',
			'scroll',
			'select',
			'submit',
			'unload',
			{
				eventName: 'input',
				eventType: ['input', 'propertychange'],
			},
		],
		event => {
			if (isStr(event)) event = { eventName: event, eventType: event }
			event.extend = EventDirective
			event.name = upperFirst(event.eventName) + 'EventDirective'
			return registerDirective('on' + event.eventName, event)
		}
	),
	directive => directive.name
)

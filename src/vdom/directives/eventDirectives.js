/**
 * @module vdom/directive
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:27:35 GMT+0800 (China Standard Time)
 */

import EventDirective from './EventDirective'
import { registerDirective } from '../../vnode'
import { arr2obj, map, upperFirst, isStr } from '../../helper'

export default arr2obj(
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
				eventType: ['input', 'propertychange']
			}
		],
		event => {
			if (isStr(event)) event = { eventName: event, eventType: event }
			event.extend = EventDirective
			event.name = upperFirst(event.eventName) + 'EventDirective'
			return registerDirective('on' + event.eventName, event)
		}
	),
	directive => [directive.name, directive]
)

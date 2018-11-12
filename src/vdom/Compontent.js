import { Compontent } from '../vnode'
import HTMLMixin from './HTMLMixin'
import { inherit } from '../helper'

export default inherit(
	function HTMLCompontent(option) {
		Compontent.call(this, option)
	},
	Compontent,
	{
		$htmlComp: true,
	}
)

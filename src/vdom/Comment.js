import { VComment, registerVComment } from '../vnode'
import HTMLMixin from './HTMLMixin'
import { inherit } from '../helper'

export default registerVComment(
	inherit(
		function Comment(comment) {
			VComment.call(this, comment)
			this.el = document.createComment(comment)
		},
		VComment,
		HTMLMixin(VComment),
		{
			$htmlComment: true,
		}
	)
)

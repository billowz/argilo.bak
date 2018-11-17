// @flow
/**
 * @module common/ast
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:42:22 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { inherit } from '../../helper'

import typeof { default as Stream } from './Stream'

export const OPTION_ATTACH = 'finish',
	OPTION_ERROR = 'error',
	OPTION_CAPTURABLE = 'capturable'

interface IRule {}
export type MatchError = [number, string, boolean, MatchError, IRule] & interface { $err: true }

let idGen = 0

/**
 * @typedef {Array} Rule~MatchError
 * @property {number}          0   text offset
 * @property {string}           1   msg
 * @property {boolean}          2   capturable
 * @property {Rule~MatchError}  3   source error
 * @property {Rule}             4   Rule
 */

/**
 * @callback Rule~RuleCallback
 * @param {*}               data
 * @param {MatchResultSet}  resultSet
 * @param {Stream}          stream
 * @param {Rule}            rule
 * @return {Rule~MatchError} error
 */

/**
 * Rule Interface
 * @class Rule
 * @param {string}                  name                        rule name
 * @param {Object}                  option                      rule option
 * @param {boolean}                 [option.capturable=true]    error is capturable
 * @param {Rule~RuleCallback}       option.finish               process on match finish
 * @param {Rule~RuleCallback}       option.error                process on match fail
 */
export default inherit(
	function Rule(
		name: string,
		option: {
			capturable: boolean,
			finish: Function,
			error: Function
		}
	) {
		this.id = idGen++
		this.name = name
		this.capturable = option[OPTION_CAPTURABLE] !== false
		this.onFinish = option[OPTION_ATTACH]
		this.onError = option[OPTION_ERROR]
	},
	/** @lends Rule.prototype */
	{
		/**
		 * rule mark
		 * @member {boolean}
		 * @default
		 */
		$rule: true,

		/**
		 * rule type
		 * @member {string}
		 */
		type: 'Rule',
		/**
		 * Check whether the dairy product is solid at room temperature.
		 * @abstract
		 * @param {Stream}          stream  match stream
		 * @param {MatchResultSet}  result  match resultset
		 * @return {Rule~MatchError}
		 */
		match() {
			return 'Abstract'
		},

		error(stream: Stream, err, capturable, srcErr) {
			err = [
				stream.orgOffset(),
				this.msg(err, stream, this),
				capturable && srcErr ? srcErr[2] : capturable,
				srcErr,
				this
			]
			//err.$err = true
			return err
		},
		success(stream, data, result) {
			const curr = stream.curr,
				err = this.attach(data, result, stream, this)

			assert(stream.curr == curr)

			return err && !err.$err ? this.error(stream, err, false) : err
		},

		/**
		 * get start char codes
		 *
		 * @return {Array}
		 * @default []
		 */
		getStart() {
			return []
		},

		/**
		 * prepare test before match
		 *
		 * @return {boolean}
		 * @default true
		 */
		test() {
			return true
		},

		/**
		 * set rule expression
		 * 1. make rule expression
		 * 2. make rule Expect text
		 *
		 * @param {string} expr
		 */
		setExpr(expr) {
			this.expr = this.mkExpr(expr)
			this.EXPECT = `Expect: ${expr}`
		},

		/**
		 * make rule expression
		 *
		 * @param {string} expr expression text
		 * @return {string} rule expression
		 */
		mkExpr(expr) {
			return `<${this.type}: ${expr}>`
		},

		/**
		 * tostring by name or expression
		 * @return {string}
		 */
		tostring() {
			return this.name || this.expr
		}
	}
)

/**
 * Rule Match ResultSet
 *
 * @class MatchResultSet
 * @param {MatchResultSet} parent  parent result
 */
export const MatchResultSet = inherit(
	function MatchResultSet(parent) {
		this.parent = parent
		this.data = []
	},
	/** @lends MatchResultSet.prototype */
	{
		/**
		 * create sub ResultSet
		 * @return {MatchResultSet}
		 */
		create() {
			return new MatchResultSet(this)
		},
		/**
		 * append data
		 * @param {?} data
		 */
		add(data) {
			this.data.push(data)
		},
		/**
		 * append datas
		 * @param {Array} datas
		 */
		addAll(datas: Array<any>) {
			const { data } = this
			const len = data.length
			let i = datas.length
			while (i--) data[len + i] = datas[i]
		},
		/**
		 * make empty result
		 */
		empty() {
			this.setLen(0)
		},
		/**
		 * reset result data size
		 *
		 * @param {number} len
		 */
		setLen(len) {
			const { data } = this
			if (data.length > len) data.length = len
		}
	}
)

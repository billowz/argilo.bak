/**
 * Function utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 23 2018 11:18:33 GMT+0800 (China Standard Time)
 */
/**
 * create function by code string
 * @param body	function body
 * @param args	function argument names
 * @param name	function name
 */
export declare function createFn<T extends Function>(body: string, args?: string[], name?: string): T;
/**
 * apply function with scope
 * @param fn	target function
 * @param scope	scope of function
 * @param args	arguments of function
 */
export declare const applyScope: (fn: Function, scope: any, args: any[] | IArguments) => any;
/**
 * apply function without scope
 * @param fn		target function
 * @param args	arguments of function
 */
export declare const applyNoScope: (fn: Function, args: any[] | IArguments) => any;
/**
 * apply function with scope
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare const applyScopeN: (fn: Function, scope: any, args: any[] | IArguments, offset: number, len: number) => any;
/**
 * apply function without scope
 * @param fn		target function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare const applyNoScopeN: (fn: Function, args: any[] | IArguments, offset: number, len: number) => any;
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 */
export declare function apply(fn: Function, scope: any, args: any[] | IArguments): any;
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare function applyN(fn: Function, scope: any, args: any[] | IArguments, offset: number, len: number): any;
/**
 * get function name
 */
export declare function fnName(fn: Function): string;
/**
 * bind scope or arguments on function
 * - return source function when without arguments and scope is undefined or null
 * - only bind arguments when scope is undefined or null, well can call the new function proxy with some scope
 *
 * @example
 * 		function example() {
 * 			console.log(this, arguments);
 * 		}
 * 		var proxy = bind(example, null) 	// proxy === example
 * 		proxy() 							// log: window | undefined, []
 * 		proxy.call(1) 						// log: 1, []
 *
 * 		proxy = bind(example, null, 1) 		// proxy !== example
 * 		proxy() 							// log: window | undefined, [1]
 * 		proxy(2) 							// log: window | undefined, [1, 2]
 * 		proxy.call(1, 2) 					// log: 1, [1, 2]
 *
 * 		proxy = bind(example, {}, 1, 2)		// proxy !== example
 * 		proxy() 							// log: {}, [1]
 * 		proxy(2) 							// log: {}, [1, 2, 2]
 * 		proxy.call(1, 2) 					// log: {}, [1, 2, 2]
 *
 * @param fn	source function
 * @param scope	bind scope
 * @param args	bind arguments
 * @return function proxy
 */
export declare const bind: <T extends Function>(fn: T, scope: any, ...args: any[]) => T;
/**
 * type checker
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:28:20 GMT+0800 (China Standard Time)
 */
/**
 * is equals
 * > o1 === o2 || NaN === NaN
 */
export declare function eq(o1: any, o2: any): boolean;
/**
 * is null
 */
export declare function isNull(o: any): boolean;
/**
 * is undefined
 */
export declare function isUndef(o: any): boolean;
/**
 * is null or undefined
 */
export declare function isNil(o: any): boolean;
/**
 * is boolean
 */
export declare const isBool: (o: any) => boolean;
/**
 * is a number
 */
export declare const isNum: (o: any) => boolean;
/**
 * is a string
 */
export declare const isStr: (o: any) => boolean;
/**
 * is a function
 */
export declare const isFn: (o: any) => boolean;
/**
 * is integer number
 */
export declare function isInt(o: any): boolean;
/**
 * is primitive type
 * - null
 * - undefined
 * - boolean
 * - number
 * - string
 * - function
 */
export declare function isPrimitive(o: any): boolean;
/**
 * is instanceof
 */
export declare function instOf(obj: any, Cls: Function): boolean;
/**
 * is child instance of Type
 */
export declare function is(o: any, Type: Function | Function[]): boolean;
/**
 * is boolean or Boolean
 */
export declare const isBoolean: (o: any) => boolean;
/**
 * is number or Number
 */
export declare const isNumber: (o: any) => boolean;
/**
 * is string or String
 */
export declare const isString: (o: any) => boolean;
/**
 * is Date
 */
export declare const isDate: (o: any) => boolean;
/**
 * is RegExp
 */
export declare const isReg: (o: any) => boolean;
/**
 * is Array
 */
export declare const isArray: (o: any) => boolean;
/**
 * is Typed Array
 */
export declare const isTypedArray: (o: any) => boolean;
/**
 * is Array or pseudo-array
 * - Array
 * - String
 * - IArguments
 * - NodeList
 * - HTMLCollection
 * - Typed Array
 * - {length: int, [length-1]: any}
 */
export declare function isArrayLike(o: any): boolean;
/**
 * is simple Object
 * TODO object may has constructor property
 */
export declare function isObj(o: any): boolean;
/**
 * is empty
 * - string: trim(string).length === 0
 * - array: array.length === 0
 * - pseudo-array: pseudo-array.length === 0
 */
export declare function isBlank(o: any): boolean;
/**
 * regexp utilities
 * @module utility/reg
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:29:00 GMT+0800 (China Standard Time)
 */
/**
 * whether to support sticky on RegExp
 */
export declare const stickyReg: boolean;
/**
 * whether to support unicode on RegExp
 */
export declare const unicodeReg: boolean;
/**
 * escape string for RegExp
 */
export declare function reEscape(str: string): string;
/**
 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
 */
export declare const prototypeOf: boolean;
/**
 * whether to support `__proto__`
 */
export declare const protoProp: boolean;
/**
 * get prototype
 */
export declare const protoOf: (o: any) => any;
/**
 * set prototype
 * > properties on the prototype are not inherited on older browsers
 */
export declare const __setProto: <T>(obj: any, proto: any) => any;
/**
 * set prototype
 * > the properties on the prototype will be copied on the older browser
 */
export declare const setProto: <T>(obj: any, proto: any) => any;
/**
 * has own property
 */
export declare const hasOwnProp: (obj: any, prop: string) => boolean;
/**
 * whether to support Object.defineProperty
 */
export declare const propDescriptor: boolean;
/**
 * whether to support `__defineGetter__` and `__defineSetter__`
 */
export declare const propAccessor: boolean;
/**
 * define property
 */
export declare const defProp: (o: any, p: string | number | symbol, attributes: PropertyDescriptor & ThisType<any>) => any;
/**
 * define property by value
 */
export declare const defPropValue: <V>(obj: any, prop: string, value: V, enumerable?: boolean, configurable?: boolean, writable?: boolean) => V;
/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export declare function getOwnProp(obj: any, prop: string, defaultVal?: any): any;
/**
 * @module utility/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Sat Feb 16 2019 15:18:40 GMT+0800 (China Standard Time)
 */
export declare function parsePath(propPath: string | string[], cacheable?: boolean): string[];
export declare function formatPath(path: string | (string[] & {
	path?: string;
})): string;
export declare function get(obj: any, path: string | string[]): any;
export declare function set(obj: any, path: string | string[], value: any): void;
/**
 * String utilities
 * @module utility/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:04:55 GMT+0800 (China Standard Time)
 */
/**
 * get char code
 * > string.charCodeAt
 */
export declare function charCode(str: string, index?: number): number;
/**
 * get char by char code
 * > String.fromCharCode
 */
export declare function char(code: number): string;
export declare function cutStr(str: string, start: number, end?: number): string;
export declare function cutLStr(str: string, start: number, len?: number): string;
/**
 * trim
 */
export declare function trim(str: string): string;
export declare function upper(str: string): string;
export declare function lower(str: string): string;
export declare function upperFirst(str: string): string;
export declare function lowerFirst(str: string): string;
export declare function escapeStr(str: string): string;
/**
 * @module utility/format
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
 * @modified Sat Feb 16 2019 15:25:34 GMT+0800 (China Standard Time)
 */
export declare function pad(str: string, len: number, chr?: string, leftAlign?: boolean | number): string;
export declare function shorten(str: string, len: number, suffix?: string): string;
export declare const thousandSeparate: (numStr: string) => string, binarySeparate: (numStr: string) => string, octalSeparate: (numStr: string) => string, hexSeparate: (numStr: string) => string;
export declare function plural(str: string): string;
export declare function singular(str: string): string;
export declare type FormatFlags = number;
export declare const FORMAT_XPREFIX: FormatFlags;
export declare const FORMAT_PLUS: FormatFlags;
export declare const FORMAT_ZERO: FormatFlags;
export declare const FORMAT_SPACE: FormatFlags;
export declare const FORMAT_SEPARATOR: FormatFlags;
export declare const FORMAT_LEFT: FormatFlags;
export declare type FormatCallback = (val: any, flags: FormatFlags, width: number, fill: string, precision: number, shortenSuffix: string) => string;
export declare function extendFormatter(obj: {
	[key: string]: FormatCallback;
}): void;
export declare function getFormatter(name: string): FormatCallback;
/**
 * Syntax:
 * @example
 * 	'{'
 * 		(<parameter>)?
 * 		(
 * 			':'
 * 			(<flags>)?
 * 			(
 * 				<width> ('=' <fill-char>)?
 * 			)?
 * 			(
 * 				'.'
 * 				<precision> ('=' '"' <shorten-suffix> '"')?
 * 			)?
 * 		)?
 * 		(<type>)?
 * 	'}'
 *
 * - parameter
 * 		- {}					format by next unused argument
 * 		- {<number>}			format by arguments[number]
 * 		- {@}					format by current used argument
 * 		- {$}					format by next unused argument
 * 		- {{name}}				format by "name" property on next unused argument
 * 		- {<number>{name}}		format by "name" property on arguments[number]
 * 		- {@{name}}				format by "name" property on current used argument
 * 		- {${name}}				format by "name" property on next unused argument
 * @example
 * 		format('<{} {}>', 'abc')				// return "<abc undefined>"
 * 		format('<{$} {$}>', 'abc')				// return "<abc undefined>"
 * 		format('<{@} {} {@}>', 'abc')			// return "<abc abc abc>"
 * 		format('<{0} {} {0}>', 'abc')			// return "<abc abc abc>"
 * 		format('<{0{value}} {${value}} {@{value}} {{value.a}}>', {value: 'abc'}, {value: {a: 'cbd'}})
 * 		// return "<abc abc abc bcd>"
 * 		format('<{0{[0]}} {${[0]}} {@{[0]}} {{[0].a}}>', ['abc'], [{a: 'cbd'}])
 * 		// return "<abc abc abc bcd>"
 *
 * - flags
 * 		- {:#}    	FORMAT_XPREFIX
 * 					ensure the leading "0" for any octal
 * 					prefix non-zero hexadecimal with "0x" or "0X"
 * 					prefix non-zero binary with "0b" or "0B"
 * 		- {:+}    	FORMAT_PLUS
 * 					Forces to preceed the result with a plus or minus sign (+ or -) even for positive numbers.
 * 					By default, only negative numbers are preceded with a - sign
 * 		- {:0}		FORMAT_ZERO
 * 					Left-pads the number with zeroes (0) instead of spaces when padding is specified
 * 		- {: }   	FORMAT_SPACE
 * 					If no sign is going to be written, a blank space is inserted before the value
 * 		- {:,}		FORMAT_SEPARATOR
 * 					use thousand separator on decimal number
 * 					hexadecimal number: FFFFFFFF => FFFF,FFFF
 * 					octal number: 77777777 => 7777,7777
 * 					binary number: 1111111111111111 => 11111111,11111111
 * 		{:-}    	FORMAT_LEFT
 * 					Left-justify within the given field width; Right justification is the default
 * @example
 * 		format('<{: d}>',  12);		// return "< 12>"
 *		format('<{: d}>',   0);		// return "< 0>"
 *		format('<{: d}>', -12);		// return "<-12>"
 *		format('<{:+d}>',  12);		// return "<+12>"
 *		format('<{:+d}>',   0);		// return "<+0>"
 *		format('<{:+d}>', -12);		// return "<-12>"
 *		format('<{:6s}>',  12);		// return "<    12>"
 *		format('<{:-6s}>', 12);		// return "<12    >"
 *		format('<{:#o}>',  12);		// return "<014>"
 *		format('<{:#x}>',  12);		// return "<0xc>"
 *		format('<{:#X}>',  12);		// return "<0XC>"
 *		format('<{:#b}>',  12);		// return "<0b1100>"
 *		format('<{:#B}>',  12);		// return "<0B1100>"

 * - width
 * 		Minimum number of characters to be printed.
 * 		If the value to be printed is shorter than this number, the result is padded with pad char(default is space).
 * 		The value is not truncated even if the result is larger.
 *		- width value
 * 			{:<number>}
 * 			{:&@}
 * 			{:&$}
 * 			{:&<number>}
 * 			{:&@{<prop>}}
 * 			{:&${<prop>}}
 * 			{:&<number>{<prop>}}
 *		- pad char
 * 			{:&@=<pad-char>}
 * 			{:&$=<pad-char>}
 * 			{:&<number>=<pad-char>}
 * 			{:&@{<prop>}=<pad-char>}
 * 			{:&${<prop>}=<pad-char>}
 * 			{:&<number>{<prop>}=<pad-char>}
 * @example
 *
 * - precision
 * 		For integer specifiers (d,  o, u, x, X): precision specifies the minimum number of digits to be written.
 * 		If the value to be written is shorter than this number, the result is padded with leading zeros.
 * 		The value is not truncated even if the result is longer. A precision of 0 means that no character is written for the value 0.
 * 		For a, A, e, E, f and F specifiers: this is the number of digits to be printed after the decimal point (by default, this is 6).
 * 		For g and G specifiers: This is the maximum number of significant digits to be printed.
 * 		For s: this is the maximum number of characters to be printed. By default all characters are printed until the ending null character is encountered.
 * 		If the period is specified without an explicit value for precision, 0 is assumed.
 * 		- precision value
 * 			{:.<number>}
 * 			{:.&@}
 * 			{:.&$}
 * 			{:.&<number>}
 * 			{:.&@{<prop>}}
 * 			{:.&${<prop>}}
 * 			{:.&<number>{<prop>}}
 * 		- shorten suffix
 * 			{:.&@="<suffix>"}
 * 			{:.&$="<suffix>"}
 * 			{:.&<number>="<suffix>"}
 * 			{:.&@{<prop>}="<suffix>"}
 * 			{:.&${<prop>}="<suffix>"}
 * 			{:.&<number>{<prop>}="<suffix>"}
 * - type
 * 		- default types
 *			- {c}		Character
 * 			- {s}		String
 * 			- {j}		JSON String
 * 			- {y}		Date Year
 * 			- {m}		Date Month
 * 			- {w}		Date Weekly
 * 			- {W}		Date Weekly
 * 			- {D}		Date
 * 			- {H}		Date
 * 			- {M}		Date
 * 			- {S}		Date
 * 			- {d} 		Signed decimal integer
 *			- {u}		Unsigned decimal integer
 *			- {o}		Unsigned octal
 *			- {x}		Unsigned hexadecimal integer
 *			- {X}		Unsigned hexadecimal integer (uppercase)
 *			- {f}		Decimal floating point, lowercase,
 *			- {e}		Scientific notation (mantissa/exponent), lowercase
 *			- {E}		Scientific notation (mantissa/exponent), uppercase
 *			- {g}		Use the shortest representation: %e or %f
 *			- {G}		Use the shortest representation: %E or %F
 * - Rules
 * 		- property-path
 * 				(
 * 					(?:
 * 						[a-zA-Z$_][\w$_]*|
 * 						\[
 * 						(?:
 * 							\d+|
 * 							"(?:[^\\"]|\\.)*"|
 * 							'(?:[^\\']|\\.)*'
 * 						)
 * 						\]
 * 					)
 * 					(?:
 * 						\.[a-zA-Z$_][\w$_]*|
 * 						\[
 * 						(?:
 * 							\d+|
 * 							"(?:[^\\"]|\\.)*"|
 * 							'(?:[^\\']|\\.)*'
 * 						)
 * 						\]
 * 					)*
 * 				)
 * 		- expression
 * 			/\\.|												// escape
 * 			(													// 1: expression
 * 				\{
 * 				(\d+|\$|@)?										// 2: parameter index
 * 				(?:\{<property-path>\})?						// 3: property path of parameter
 * 				(?:
 * 					:
 * 					([#,+\- ]*)									// 4: flags
 * 					(?:
 * 						(?:
 * 							(\d+)|								// 5: width
 * 							(?:
 * 								&
 * 								(\d+|\$|@)						// 6: parameter index of width
 * 								(?:\{<property-path>\})?		// 7: property path of width parameter
 * 							)
 * 						)
 * 						(?:=(.))?								// 8: pad fill
 * 					)?
 * 					(?:
 * 						\.
 * 						(?:
 * 							(\d+)|								// 9: width
 * 							(?:
 * 								&
 * 								(\d+|\$|@)						// 10: parameter index of width
 * 								(?:\{<property-path>\})?		// 11: property path of width parameter
 * 							)
 * 						)
 * 						(?:
 * 							=
 * 							"
 * 							((?:[^\\"]|\\.)*)					// 12: shorten su
 * 							"
 * 						)
 * 					)?
 * 				)?
 * 				([a-zA-Z_][a-zA-Z0-9_$]*)?						// 13: data type
 * 				\}
 * 			)/
 * @param fmt 		format String
 * @param args		format arguments
 * @param offset	start offset of arguments
 * @param getParam	get parameter on arguments callback
 */
export declare function vformat<T>(fmt: string, args: T, offset?: number, getParam?: (args: T, idx: number) => any): string;
/**
 * @see vformat
 * @param fmt	format string
 * @param args	format arguments
 */
export declare function format(fmt: string, ...args: any): string;
/**
 * @see vformat
 * @param fmt		format string
 * @param offset	start offset of arguments
 * @param getParam	get parameter on arguments callback
 */
export declare function formatter(fmt: string, offset?: number, getParam?: (args: IArguments, idx: number) => any): (...args: any[]) => string;
/**
 * Object.create polyfill
 * @module utility/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 18:19:24 GMT+0800 (China Standard Time)
 */
/**
 * create object
 */
export declare const create: {
	(o: object): any;
	(o: object, properties: PropertyDescriptorMap & ThisType<any>): any;
};
/**
 * @param prop
 * @param target
 * @param override
 * @return is assign
 */
export declare type AssignFilter = (prop: string, target: any, override: any) => boolean;
/**
 *
 * @param target
 * @param overrides
 * @param filter
 * @param startOffset 	start offset in overrides, default: 0
 * @param endOffset 	end offset in overrides, default: overrides.length-1
 */
export declare function doAssign(target: any, overrides: object[] | IArguments, filter: AssignFilter, startOffset?: number, endOffset?: number): any;
/**
 * assign properties
 * > Object.assign shim
 */
export declare function assign(target: any, ...args: any[]): any;
/**
 * assign un-exist properties
 */
export declare function assignIf(target: any, ...args: any[]): any;
/**
 * default assign filter
 * - property is owner in override
 * @see {AssignFilter}
 */
export declare function defaultAssignFilter(prop: string, target: any, override: any): boolean;
/**
 * assign if filter
 * - property is owner in override
 * - property not in target object
 * @see {AssignFilter}
 */
export declare function assignIfFilter(prop: string, target: any, override: any): boolean;
declare class Control {
	private __desc;
	constructor(desc: string);
	toString(): string;
}
export interface ObjArray {
	length: number;
}
export declare type IArray = any[] | string | IArguments | ObjArray;
/**
 * STOP Control
 * > stop each/map/indexOf...
 */
export declare const STOP: Control;
/**
 * each callback on object
 * - will stop each on return STOP
 */
export declare type EachPropCallback = (prop: string, obj: object) => Control | void;
/**
 * each properties
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export declare function eachProps(obj: object, callback: EachPropCallback, own: boolean): false | string;
export declare function eachProps(obj: object, callback: EachPropCallback, scope?: any, own?: boolean): false | string;
/**
 * each callback on object
 * - will stop each on callback return STOP
 */
export declare type EachObjCallback = (value: any, prop: string, obj: object) => Control | void;
/**
 * each object
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export declare function eachObj(obj: object, callback: EachObjCallback, own: boolean): false | string;
export declare function eachObj(obj: object, callback: EachObjCallback, scope?: any, own?: boolean): false | string;
/**
 * each callback on array
 * - will stop each on callback return STOP
 */
export declare type EachArrayCallback = (data: any, index: number, array: IArray) => Control | void;
/**
 * each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
export declare function eachArray(array: IArray, callback: EachArrayCallback, scope?: any): false | number;
/**
 * each
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties on object, default: true
 * @return stoped index or false
 */
export declare function each(obj: IArray, callback: EachArrayCallback, scope?: any): false | number;
export declare function each(obj: object, callback: EachObjCallback, own?: boolean): false | string;
export declare function each(obj: object, callback: EachObjCallback, scope?: any, own?: boolean): false | string;
export declare function each(obj: object | IArray, callback: EachObjCallback | EachArrayCallback, own?: boolean): false | number | string;
export declare function each(obj: object | IArray, callback: EachObjCallback | EachArrayCallback, scope?: any, own?: boolean): false | number | string;
/**
 * SKIP Control
 * > skip map
 */
export declare const SKIP: Control;
/**
 * callback on object
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param value	property value
 * @param prop	property name
 * @param obj	map target
 */
export declare type MapObjCallback<T> = (callback: any, prop: string, obj: object) => T | Control;
/**
 * object: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param obj		map target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		map own properties, default: true
 */
export declare function mapObj<T>(obj: object, callback: MapObjCallback<T>, own?: boolean): {
	[key: string]: T;
};
export declare function mapObj<T>(obj: object, callback: MapObjCallback<T>, scope?: any, own?: boolean): {
	[key: string]: T;
};
/**
 * callback on array
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param data	item data
 * @param index	item index
 * @param array	map target
 */
export declare type MapArrayCallback<T> = (data: any, index: number, array: IArray) => T | Control;
/**
 * array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export declare function mapArray<T>(array: IArray, callback: MapArrayCallback<T>, scope?: any): T[];
/**
 * map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param obj		map target
 * @param value		map value of callback
 * @param scope		scope of callback
 * @param own		map own properties on object, default: true
 * @return array index or property name or -1
 */
export declare function map<T>(obj: IArray, callback: MapArrayCallback<T>, scope?: any): any[];
export declare function map<T>(obj: object, callback: MapObjCallback<T>, own?: boolean): {
	[key: string]: T;
};
export declare function map<T>(obj: object, callback: MapObjCallback<T>, scope?: any, own?: boolean): {
	[key: string]: T;
};
export declare function map<T>(obj: object | IArray, callback: MapObjCallback<T> | MapArrayCallback<T>, own?: boolean): {
	[key: string]: T;
} | any[];
export declare function map<T>(obj: object | IArray, callback: MapObjCallback<T> | MapArrayCallback<T>, scope?: any, own?: boolean): {
	[key: string]: T;
} | any[];
/**
 * indexOf callback on object
 * - will stop find on callback return STOP
 * @param value	property value
 * @param prop	property name
 * @param obj		indexOf target
 * @return
 * - boolean: is finded
 * - void: find next
 * - STOP: stop find
 */
export declare type IdxOfObjCallback = (value: any, prop: string, obj: object) => boolean | Control | void;
/**
 * object: indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param callback	find value or callback
 * @param scope		scope of callback
 * @param own		find own properties, default: true
 * @return property name or -1
 */
export declare function idxOfObj(obj: object, value: any, own?: boolean): -1 | string;
export declare function idxOfObj(obj: object, value: IdxOfObjCallback, own?: boolean): -1 | string;
export declare function idxOfObj(obj: object, value: IdxOfObjCallback, scope?: any, own?: boolean): -1 | string;
/**
 * indexOf callback on array
 * - will stop find on callback return STOP
 * @param data	item data
 * @param index	item index
 * @param array	indexOf target
 * @return
 * - boolean: is finded
 * - void: find next
 * - STOP: stop find
 */
export declare type IdxOfArrayCallback = (data: any, index: number, array: IArray) => boolean | Control | void;
/**
 * array: indexOf
 * - will stop find on callback return STOP
 * @param array		find target
 * @param value		find value or callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export declare function idxOfArray(array: IArray, value: any): number;
export declare function idxOfArray(array: IArray, value: IdxOfArrayCallback, scope?: any): number;
/**
 * indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param value		find value of callback
 * @param scope		scope of callback
 * @param own		find own properties on object, default: true
 * @return array index or property name or -1
 */
export declare function idxOf(obj: IArray, value: any): number | string;
export declare function idxOf(obj: object, value: any, own?: boolean): number | string;
export declare function idxOf(obj: object | IArray, value: any, own?: boolean): number | string;
export declare function idxOf(obj: IArray, value: IdxOfArrayCallback, scope?: any): number;
export declare function idxOf(obj: object, value: IdxOfObjCallback, own?: boolean): -1 | string;
export declare function idxOf(obj: object, value: IdxOfObjCallback, scope?: any, own?: boolean): -1 | string;
export declare function idxOf(obj: object | IArray, value: IdxOfObjCallback | IdxOfArrayCallback, own?: boolean): number | string;
export declare function idxOf(obj: object | IArray, value: IdxOfObjCallback | IdxOfArrayCallback, scope?: any, own?: boolean): number | string;
/**
 * reduce callback on object
 * - will stop reduce on return STOP
 */
export declare type ReduceObjCallback<T> = (accumulator: T, value: any, prop: string, obj: object) => T | Control;
/**
 * reduce object
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties, default: true
 */
export declare function reduceObj<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, own?: boolean): any;
export declare function reduceObj<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, scope?: any, own?: boolean): any;
/**
 * reduce callback on array
 * - will stop reduce on return STOP
 */
export declare type ReduceArrayCallback<T> = (accumulator: T, data: any, index: number, array: IArray) => T | Control;
/**
 * reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
export declare function reduceArray<T>(array: IArray, accumulator: T, callback: ReduceArrayCallback<T>, scope?: any): T;
/**
 * reduce
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties of reduce object, default: true
 */
export declare function reduce<T>(obj: IArray, accumulator: T, callback: ReduceArrayCallback<T>, scope?: any): T;
export declare function reduce<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, own?: boolean): T;
export declare function reduce<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, scope?: any, own?: boolean): T;
export declare function reduce<T>(obj: object | IArray, accumulator: T, callback: ReduceObjCallback<T> | ReduceArrayCallback<T>, own?: boolean): T;
export declare function reduce<T>(obj: object | IArray, accumulator: T, callback: ReduceObjCallback<T> | ReduceArrayCallback<T>, scope?: any, own?: boolean): T;
export declare type ObjKeyHandler<T> = (prop: string, obj: object) => T | Control;
/**
 * @param obj		target
 * @param handler	key handler
 * @param scope		scope or handler
 * @param own		is get own properties, default: true
 */
export declare function keys<T>(obj: object, own?: boolean): T[];
export declare function keys<T>(obj: object, callback: ObjKeyHandler<T>, own?: boolean): T[];
export declare function keys<T>(obj: object, callback: ObjKeyHandler<T>, scope?: any, own?: boolean): T[];
export declare type ObjValueHandler<T> = (value: any, prop: string, obj: object) => T | Control;
/**
 * @param obj		target
 * @param handler	value handler
 * @param scope		scope or handler
 * @param own		is get own properties, default: true
 */
export declare function values<T>(obj: object, own?: boolean): T[];
export declare function values<T>(obj: object, callback: ObjValueHandler<T>, own?: boolean): T[];
export declare function values<T>(obj: object, callback: ObjValueHandler<T>, scope?: any, own?: boolean): T[];
/**
 * @return STOP or SKIP or [key: string, value: any]
 */
export declare type Arr2ObjCallback = (data: any, index: number, array: IArray) => Control | [string, any];
/**
 * convert array to object
 */
export declare function arr2obj(array: IArray, callback: Arr2ObjCallback, scope?: any): object;
/**
 * convert array or string to object
 * @param array
 * @param val	value or callback
 * @param split	split char on string
 */
export declare function makeMap(array: IArray, val: Arr2ObjCallback, split?: string): object;
export declare function makeMap(array: IArray, val?: any, split?: string): object;
export declare function makeArray<T>(len: number, callback: (index: number) => T): T[];
/**
 * Double Linked List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 18:30:02 GMT+0800 (China Standard Time)
 */
export declare class List<T> {
	static readonly binding: string;
	readonly binding: string;
	private __head?;
	private __tail?;
	private __length;
	private __scaning;
	private __lazyRemoves?;
	constructor(binding?: string);
	size(): number;
	has(obj: T): boolean;
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	add(obj: T): number;
	addFirst(obj: T): number;
	insertAfter(obj: T, target?: T): number;
	insertBefore(obj: T, target?: T): number;
	addAll(objs: T[]): number;
	addFirstAll(objs: T[]): number;
	insertAfterAll(objs: T[], target?: T): number;
	insertBeforeAll(objs: T[], target?: T): number;
	prev(obj: T): T;
	next(obj: T): T;
	first(): T;
	last(): T;
	each(cb: (obj: T) => boolean | void, scope?: any): void;
	toArray(): T[];
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	remove(obj: T): number;
	pop(): void;
	clean(): void;
	private __initNode;
	private __getNode;
	private __siblingObj;
	private __doInsert;
	private __insert;
	private __insertAll;
	private __remove;
	private __lazyRemove;
	private __doLazyRemove;
	private __doRemove;
	private __clean;
}
/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 17:23:10 GMT+0800 (China Standard Time)
 */
export declare class FnList<T extends Function> {
	static readonly fnBinding: string;
	static readonly scopeBinding: string;
	readonly fnBinding: string;
	readonly scopeBinding: string;
	private readonly __list;
	private __nodeMap;
	constructor(fnBinding?: string, scopeBinding?: string);
	add(fn: T, scope?: any): number;
	remove(fn: T, scope?: any): number;
	has(fn: T, scope?: any): boolean;
	size(): number;
	clean(): void;
	each(cb: (fn: T, scope: any) => boolean | void, scope?: any): void;
}
export declare function nextTick(fn: Function, scope?: any): void;
export declare function clearTick(fn: Function, scope?: any): void;
/**
 * @module utility/Source
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 17 2018 10:41:21 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 14:37:32 GMT+0800 (China Standard Time)
 */
export declare class Source {
	readonly buff: string;
	readonly len: number;
	private __lines;
	private __linePos;
	constructor(buff: string);
	position(offset: number): [number, number, string];
	source(escape?: boolean): string;
}
export declare type CheckPoint = [number, number];
declare class MatchContext {
	readonly source: Source;
	readonly parent: MatchContext;
	result: any[];
	data: any;
	private __buff;
	private __offset;
	private __orgOffset;
	private __advanced;
	private __code;
	constructor(source: Source, buff: string, offset: number, orgOffset: number, parent?: MatchContext);
	private __flushCode;
	/**
	 * create sub Context
	 */
	create(): MatchContext;
	private __setAdvanced;
	/**
	 * commit context state to parent context
	 */
	commit(): void;
	/**
	 * marge context state
	 */
	margeState(context: MatchContext): void;
	/**
	 * rollback state and result
	 * @param checkpoint 	rollback to checkpoint
	 */
	rollback(checkpoint?: CheckPoint): void;
	/**
	 * get a check point
	 */
	checkpoint(): CheckPoint;
	/**
	 * advance buffer position
	 */
	advance(i: number): void;
	/**
	 * advanced buff length
	 */
	advanced(): number;
	/**
	 * get buffer
	 * @param reset reset buffer string from 0
	 */
	buff(reset?: boolean): string;
	orgBuff(): string;
	offset(): number;
	startPos(): number;
	currPos(): number;
	pos(): [number, number];
	/**
	 * get next char code
	 * @return number char code number
	 */
	nextCode(): number;
	nextChar(): string;
	/**
	 * append result
	 */
	add(data: any): void;
	/**
	 * append resultset
	 */
	addAll(data: any[]): void;
	/**
	 * get result size
	 */
	resultSize(): number;
}
declare class MatchError {
	readonly $ruleErr: boolean;
	readonly rule: Rule;
	readonly context: MatchContext;
	readonly source: MatchError;
	readonly target: MatchError;
	capturable: boolean;
	readonly pos: number;
	msg: string;
	constructor(msg: string, capturable: boolean, source: MatchError, context: MatchContext, rule: Rule);
	position(): [number, number, string];
}
export declare type onMatchCallback = (data: any, len: number, context: MatchContext, rule: Rule) => MatchError | string | void;
export declare type onErrorCallback = (err: MatchError, context: MatchContext, rule: Rule) => MatchError | string | void;
export declare type RuleOptions = {
	/**
	 * error is capturable
	 */
	capturable?: boolean;
	/**
	 * matched callback
	 */
	match?: (data: any, len: number, context: MatchContext, rule: Rule) => MatchError | string | void;
	/**
	 * error callback
	 */
	err?: (err: MatchError, context: MatchContext, rule: Rule) => MatchError | string | void;
};
declare class Rule {
	readonly $rule: boolean;
	type: string;
	readonly id: number;
	readonly name: string;
	readonly capturable: boolean;
	protected expr: string;
	protected EXPECT: string;
	readonly onMatch: onMatchCallback;
	readonly onErr: onErrorCallback;
	protected startCodeIdx: any[];
	protected startCodes: number[];
	/**
	 * @param name			rule name
	 * @param capturable	error is capturable
	 * @param onMatch		callback on matched, allow modify the match result or return an error
	 * @param onErr			callback on Error, allow to ignore error or modify error message or return new error
	 */
	constructor(name: string, options: RuleOptions);
	/**
	 * create Error
	 * @param msg 			error message
	 * @param context 		match context
	 * @param capturable 	is capturable error
	 * @param src 			source error
	 */
	mkErr(msg: string, context: MatchContext, capturable?: boolean, source?: MatchError): MatchError;
	/**
	 * match fail
	 * @param msg 			error message
	 * @param context 		match context
	 * @param capturable 	is capturable error
	 * @param src 			source error
	 * @return Error|void: may ignore Error in the error callback
	 */
	protected error(msg: string, context: MatchContext, src?: MatchError, capturable?: boolean): MatchError;
	/**
	 * match success
	 * > attach the matched result by match callback
	 * @param data 		matched data
	 * @param len  		matched data length
	 * @param context 	match context
	 * @return Error|void: may return Error in the match callback
	 */
	protected matched(data: any, len: number, context: MatchContext): MatchError;
	protected enter(context: MatchContext): MatchContext;
	/**
	 * match
	 * @param context match context
	 */
	match(context: MatchContext): MatchError;
	/**
	 * get start char codes
	 */
	getStart(stack?: number[]): number[];
	/**
	 * prepare test before match
	 */
	test(context: MatchContext): boolean;
	protected startCodeTest(context: MatchContext): boolean;
	protected setStartCodes(start: number | string | any[], ignoreCase?: boolean): void;
	protected setCodeIdx(index: any[]): void;
	/**
	 * make rule expression
	 * @param expr expression text
	 */
	protected mkExpr(expr: string): string;
	/**
	 * set rule expression
	 * 		1. make rule expression
	 * 		2. make Expect text
	 */
	protected setExpr(expr: string): void;
	getExpr(stack?: number[]): string;
	/**
	 * toString by name or expression
	 */
	toString(): string;
}
declare class MatchRule extends Rule {
	/**
	 * @param name 			match name
	 * @param start 		start char codes, prepare test by start char codes before match
	 * @param ignoreCase	ignore case for the start char codes
	 * @param options		Rule Options
	 */
	constructor(name: string, start: number | string | any[], ignoreCase: boolean, options: RuleOptions);
	/**
	 * consume matched result
	 * @param data 		matched result
	 * @param len 		matched chars
	 * @param context 	match context
	 */
	comsume(data: string | string[], len: number, context: MatchContext): MatchError;
}
export declare type ComplexRuleBuilder = (rule: Rule) => Rule[];
declare class ComplexRule extends Rule {
	readonly split: string;
	private builder;
	protected EXPECTS: string[];
	protected rules: Rule[];
	protected readonly rMin: number;
	protected readonly rMax: number;
	/**
	 * @param name 			match name
	 * @param builder 		callback of build rules
	 * @param options		Rule Options
	 */
	constructor(name: string, repeat: [number, number], builder: ComplexRuleBuilder, options: RuleOptions);
	parse(buff: string, data?: any): any[];
	init(): ComplexRule;
	__init(rules: Rule[]): void;
	protected rmatch(context: MatchContext): MatchError;
	protected setCodeIdx(index: any[]): void;
	getRules(): Rule[];
	getStart(stack?: number[]): number[];
	consume(context: MatchContext): MatchError;
	private rnames;
	getExpr(stack?: number[]): string;
}
declare class AndRule extends ComplexRule {
	__init(rules: Rule[]): void;
	match(context: MatchContext): MatchError;
	protected rmatch(context: MatchContext): MatchError;
	testRule(rule: Rule, i: number, ctx: MatchContext): MatchError;
}
declare class OrRule extends ComplexRule {
	index: Rule[][];
	__init(rules: Rule[]): void;
	match(context: MatchContext): MatchError;
	protected rmatch(context: MatchContext): MatchError;
}
export declare const discardMatch: onMatchCallback;
export declare function appendMatch(data: any, len: number, context: MatchContext): void;
export declare function attachMatch(callback: (data: any, len: number, context: MatchContext, rule: Rule) => any): onMatchCallback;
export declare function attachMatch(val: any): onMatchCallback;
export declare function match(desc: MatchRuleDescriptor): MatchRule;
export declare function match(name: string, pattern: RegExp, pick?: boolean | number, startCodes?: number | string | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, pick: boolean | number, capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, pick: boolean | number, startCodes: number | string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, pick: boolean | number, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, startCodes: string | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, startCodes: string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: RegExp, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, pick?: boolean | number, startCodes?: number | string | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, pick: boolean | number, capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, pick: boolean | number, startCodes: number | string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, pick: boolean | number, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, startCodes: string | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, startCodes: string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: RegExp, onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: number | string | any[], ignoreCase?: boolean, capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: number | string | any[], ignoreCase: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(name: string, pattern: number | string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: number | string | any[], ignoreCase?: boolean, capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: number | string | any[], ignoreCase: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function match(pattern: number | string | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): MatchRule;
export declare function and(desc: ComplexRuleDescriptor): AndRule;
export declare function and(name: string, rules: ((rule: Rule) => any[]) | any[], repeat?: [number, number], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function and(name: string, rules: ((rule: Rule) => any[]) | any[], capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function and(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function and(rules: ((rule: Rule) => any[]) | any[], repeat?: [number, number], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function and(rules: ((rule: Rule) => any[]) | any[], capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function and(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function any(desc: ComplexRuleDescriptor): AndRule;
export declare function any(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function any(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function any(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function any(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function many(desc: ComplexRuleDescriptor): AndRule;
export declare function many(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function many(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function many(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function many(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function option(desc: ComplexRuleDescriptor): AndRule;
export declare function option(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function option(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function option(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function option(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): AndRule;
export declare function or(desc: ComplexRuleDescriptor): OrRule;
export declare function or(name: string, rules: ((rule: Rule) => any[]) | any[], repeat?: [number, number], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function or(name: string, rules: ((rule: Rule) => any[]) | any[], capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function or(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function or(rules: ((rule: Rule) => any[]) | any[], repeat?: [number, number], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function or(rules: ((rule: Rule) => any[]) | any[], capturable: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function or(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function anyOne(desc: ComplexRuleDescriptor): OrRule;
export declare function anyOne(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function anyOne(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function anyOne(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function anyOne(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function manyOne(desc: ComplexRuleDescriptor): OrRule;
export declare function manyOne(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function manyOne(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function manyOne(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function manyOne(rules: ((rule: Rule) => any[]) | any[], onMatch: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function optionOne(desc: ComplexRuleDescriptor): OrRule;
export declare function optionOne(name: string, rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function optionOne(name: string, rules: ((rule: Rule) => any[]) | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function optionOne(rules: ((rule: Rule) => any[]) | any[], capturable?: boolean, onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare function optionOne(rules: ((rule: Rule) => any[]) | any[], onMatch?: onMatchCallback, onErr?: onErrorCallback): OrRule;
export declare type MatchRuleDescriptor = {
	name?: string;
	pattern: RegExp | number | string | any[];
	pick?: boolean | number;
	startCodes?: number | string | any[];
	ignoreCase?: boolean;
} & RuleOptions;
export declare type ComplexRuleDescriptor = {
	name?: string;
	rules: ((rule: Rule) => any[]) | any[];
	repeat?: [number, number];
	capturable?: boolean;
	onMatch?: onMatchCallback;
	onErr?: onErrorCallback;
} & RuleOptions;
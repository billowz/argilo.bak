/// <reference types="node" />

export declare function isDKey(key: string): any;
export declare function addDKey(key: string): string;
export declare function addDKeys(...keys: string[]): void;
export declare function getDKeys(): any[];
export declare function getDKeyMap(): any[];
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:26:23 GMT+0800 (China Standard Time)
 */
/**
 * create function by code string
 * @param body	function body
 * @param args	function argument names
 * @param name	function name
 */
export declare function createFn<T extends (...args: any[]) => any>(body: string, args?: string[], name?: string): T;
/**
 * apply function with scope
 * @param fn	target function
 * @param scope	scope of function
 * @param args	arguments of function
 */
export declare const applyScope: (fn: (...args: any[]) => any, scope: any, args: any[] | IArguments) => any;
/**
 * apply function without scope
 * @param fn		target function
 * @param args	arguments of function
 */
export declare const applyNoScope: (fn: (...args: any[]) => any, args: any[] | IArguments) => any;
/**
 * apply function with scope
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare const applyScopeN: (fn: (...args: any[]) => any, scope: any, args: any[] | IArguments, offset: number, len: number) => any;
/**
 * apply function without scope
 * @param fn		target function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare const applyNoScopeN: (fn: (...args: any[]) => any, args: any[] | IArguments, offset: number, len: number) => any;
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 */
export declare function apply(fn: (...args: any[]) => any, scope: any, args: any[] | IArguments): any;
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export declare function applyN(fn: (...args: any[]) => any, scope: any, args: any[] | IArguments, offset: number, len: number): any;
/**
 * get function name
 */
export declare function fnName(fn: (...args: any[]) => any): string;
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
export declare const bind: <T extends (...args: any[]) => any>(fn: T, scope: any, ...args: any[]) => T;
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:26:03 GMT+0800 (China Standard Time)
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
 * is simple Object
 * TODO object may has constructor property
 */
export declare function isObject(o: any): boolean;
/**
 * is empty
 * - string: trim(string).length === 0
 * - array: array.length === 0
 * - pseudo-array: pseudo-array.length === 0
 */
export declare function isBlank(o: any): boolean;
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:25:13 GMT+0800 (China Standard Time)
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
export declare const protoOf: typeof Object.getPrototypeOf;
/**
 * set prototype
 * > properties on the prototype are not inherited on older browsers
 */
export declare const __setProto: typeof Object.setPrototypeOf;
/**
 * set prototype
 * > the properties on the prototype will be copied on the older browser
 */
export declare const setProto: typeof Object.setPrototypeOf;
/**
 * whether to support Object.defineProperty
 * @constant
 */
export declare let propDescriptor: boolean;
/**
 * whether to support `__defineGetter__` and `__defineSetter__`
 */
export declare const propAccessor: boolean;
/**
 * define property
 */
export declare const defProp: typeof Object.defineProperty;
export declare function defValue<V>(obj: any, prop: string, value: V, enumerable?: boolean, configurable?: boolean, writable?: boolean): V;
export declare function defAccessor(obj: any, prop: string, get: () => any, set: (v: any) => void, enumerable?: boolean, configurable?: boolean): void;
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 12:42:51 GMT+0800 (China Standard Time)
 */
/**
 * has own property
 */
export declare const hasOwnProp: (obj: any, prop: string) => boolean;
/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export declare function getOwnProp(obj: any, prop: string, defaultVal?: any): any;
export declare function deepEq(actual: any, expected: any): boolean;
export declare function doDeepEq(actual: any, expected: any, eq: (actual: any, expected: any) => boolean, eqObj: (actual: any, expected: any) => boolean): boolean;
export declare function doDeepEqObj(actual: any, expected: any): boolean;
export declare function toStr(obj: any): String;
export declare function toStrType(obj: any): any;
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:10:44 GMT+0800 (China Standard Time)
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
 * Object.create polyfill
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:11:37 GMT+0800 (China Standard Time)
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
 * @param source
 * @return is assign
 */
export declare type AssignFilter<T, O> = (prop: string, target: T, source: O) => boolean;
/**
 *
 * @param target
 * @param sources
 * @param filter
 * @param startOffset 	start offset in sources, default: 0
 * @param endOffset 	end offset in sources, default: sources.length-1
 */
export declare function doAssign<T extends object, U>(target: T, sources: [U], filter: AssignFilter<T, U>): T & U;
export declare function doAssign<T extends object, U, V>(target: T, sources: [U, V], filter: AssignFilter<T, U | V>): T & U & V;
export declare function doAssign<T extends object, U, V, W>(target: T, sources: [U, V], filter: AssignFilter<T, U | V | W>): T & U & W;
export declare function doAssign<T extends object>(target: T, sources: any[] | IArguments, filter: AssignFilter<T, object>, startOffset?: number, endOffset?: number): any;
/**
 * assign properties
 * > Object.assign shim
 */
export declare function assign<T, U>(target: T, source: U): T & U;
export declare function assign<T, U, V>(target: T, source: U, source2: V): T & U & V;
export declare function assign<T, U, V, W>(target: T, source: U, source2: V, source3: W): T & U & W;
export declare function assign(target: object, ...args: any[]): any;
/**
 * assign un-exist properties
 */
export declare function assignIf<T, U>(target: T, source: U): T & U;
export declare function assignIf<T, U, V>(target: T, source: U, source2: V): T & U & V;
export declare function assignIf<T, U, V, W>(target: T, source: U, source2: V, source3: W): T & U & W;
export declare function assignIf(target: object, ...args: any[]): any;
/**
 * default assign filter
 * - property is owner in source
 * @see {AssignFilter}
 */
export declare function defaultAssignFilter(prop: string, target: object, source: object): boolean;
/**
 * assign if filter
 * - property is owner in source
 * - property not in target object
 * @see {AssignFilter}
 */
export declare function assignIfFilter(prop: string, target: object, source: object): boolean;
declare class Control {
	private __desc;
	constructor(desc: string);
	toString(): string;
}
export declare type IArray<T> = T[] | string | {
	length: number;
	[Symbol.iterator](): IterableIterator<T>;
};
/**
 * STOP Control
 * > stop each/map/indexOf...
 */
export declare const STOP: Control;
/**
 * each callback on object
 * - will stop each on return STOP
 */
export declare type EachPropCallback<T extends {}> = (prop: string, obj: T) => Control | void;
/**
 * each properties
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export declare function eachProps<T extends {}>(obj: T, callback: EachPropCallback<T>, own: boolean): false | string;
export declare function eachProps<T extends {}>(obj: T, callback: EachPropCallback<T>, scope?: any, own?: boolean): false | string;
/**
 * each callback on object
 * - will stop each on callback return STOP
 */
export declare type EachObjCallback<E> = (value: E, prop: string, obj: {
	[key: string]: E;
}) => Control | void;
/**
 * each object
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export declare function eachObj<E>(obj: {
	[key: string]: E;
}, callback: EachObjCallback<E>, own: boolean): false | string;
export declare function eachObj<E>(obj: {
	[key: string]: E;
}, callback: EachObjCallback<E>, scope?: any, own?: boolean): false | string;
/**
 * each callback on array
 * - will stop each on callback return STOP
 */
export declare type EachArrayCallback<E> = (data: E, index: number, array: IArray<E>) => Control | void;
/**
 * each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
export declare function eachArray<E>(array: IArray<E>, callback: EachArrayCallback<E>, scope?: any): false | number;
/**
 * each
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties on object, default: true
 * @return stoped index or false
 */
export declare function each<E>(obj: IArray<E>, callback: EachArrayCallback<E>, scope?: any): false | number;
export declare function each<E>(obj: {
	[key: string]: E;
}, callback: EachObjCallback<E>, own?: boolean): false | string;
export declare function each<E>(obj: {
	[key: string]: E;
}, callback: EachObjCallback<E>, scope?: any, own?: boolean): false | string;
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
export declare type MapObjCallback<T, E> = (data: E, prop: string, obj: {
	[key: string]: E;
}) => T | Control;
/**
 * object: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param obj		map target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		map own properties, default: true
 */
export declare function mapObj<T, E>(obj: {
	[key: string]: E;
}, callback: MapObjCallback<T, E>, own?: boolean): {
	[key: string]: T;
};
export declare function mapObj<T, E>(obj: {
	[key: string]: E;
}, callback: MapObjCallback<T, E>, scope?: any, own?: boolean): {
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
export declare type MapArrayCallback<T, E> = (data: E, index: number, array: IArray<E>) => T | Control;
/**
 * array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export declare function mapArray<T, E>(array: IArray<E>, callback: MapArrayCallback<T, E>, scope?: any): T[];
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
export declare function map<T, E>(obj: IArray<E>, callback: MapArrayCallback<T, E>, scope?: any): T[];
export declare function map<T, E>(obj: {
	[key: string]: E;
}, callback: MapObjCallback<T, E>, own?: boolean): {
	[key: string]: T;
};
export declare function map<T, E>(obj: {
	[key: string]: E;
}, callback: MapObjCallback<T, E>, scope?: any, own?: boolean): {
	[key: string]: T;
};
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
export declare type IdxOfObjCallback<E> = (value: E, prop: string, obj: {
	[key: string]: E;
}) => boolean | Control | void;
/**
 * object: indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param callback	find value or callback
 * @param scope		scope of callback
 * @param own		find own properties, default: true
 * @return property name or -1
 */
export declare function idxOfObj<E>(obj: {
	[key: string]: E;
}, value: E, own?: boolean): -1 | string;
export declare function idxOfObj<E>(obj: {
	[key: string]: E;
}, value: IdxOfObjCallback<E>, own?: boolean): -1 | string;
export declare function idxOfObj<E>(obj: {
	[key: string]: E;
}, value: IdxOfObjCallback<E>, scope?: any, own?: boolean): -1 | string;
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
export declare type IdxOfArrayCallback<E> = (data: E, index: number, array: IArray<E>) => boolean | Control | void;
/**
 * array: indexOf
 * - will stop find on callback return STOP
 * @param array		find target
 * @param value		find value or callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export declare function idxOfArray<E>(array: IArray<E>, value: E): number;
export declare function idxOfArray<E>(array: IArray<E>, value: IdxOfArrayCallback<E>, scope?: any): number;
/**
 * indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param value		find value of callback
 * @param scope		scope of callback
 * @param own		find own properties on object, default: true
 * @return array index or property name or -1
 */
export declare function idxOf<E>(obj: IArray<E>, value: E): number | string;
export declare function idxOf<E>(obj: {
	[key: string]: E;
}, value: E, own?: boolean): number | string;
export declare function idxOf<E>(obj: {
	[key: string]: E;
} | IArray<E>, value: E, own?: boolean): number | string;
export declare function idxOf<E>(obj: IArray<E>, value: IdxOfArrayCallback<E>, scope?: any): number;
export declare function idxOf<E>(obj: {
	[key: string]: E;
}, value: IdxOfObjCallback<E>, own?: boolean): -1 | string;
export declare function idxOf<E>(obj: {
	[key: string]: E;
}, value: IdxOfObjCallback<E>, scope?: any, own?: boolean): -1 | string;
/**
 * reduce callback on object
 * - will stop reduce on return STOP
 */
export declare type ReduceObjCallback<T, E> = (accumulator: T, value: E, prop: string, obj: {
	[key: string]: E;
}) => T | Control;
/**
 * reduce object
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties, default: true
 */
export declare function reduceObj<T, E>(obj: {
	[key: string]: E;
}, accumulator: T, callback: ReduceObjCallback<T, E>, own?: boolean): any;
export declare function reduceObj<T, E>(obj: {
	[key: string]: E;
}, accumulator: T, callback: ReduceObjCallback<T, E>, scope?: any, own?: boolean): any;
/**
 * reduce callback on array
 * - will stop reduce on return STOP
 */
export declare type ReduceArrayCallback<T, E> = (accumulator: T, data: E, index: number, array: IArray<E>) => T | Control;
/**
 * reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
export declare function reduceArray<T, E>(array: IArray<E>, accumulator: T, callback: ReduceArrayCallback<T, E>, scope?: any): T;
/**
 * reduce
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties of reduce object, default: true
 */
export declare function reduce<T, E>(obj: IArray<E>, accumulator: T, callback: ReduceArrayCallback<T, E>, scope?: any): T;
export declare function reduce<T, E>(obj: {
	[key: string]: E;
}, accumulator: T, callback: ReduceObjCallback<T, E>, own?: boolean): T;
export declare function reduce<T, E>(obj: {
	[key: string]: E;
}, accumulator: T, callback: ReduceObjCallback<T, E>, scope?: any, own?: boolean): T;
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
export declare type ObjValueHandler<T, E> = (value: E, prop: string, obj: {
	[key: string]: E;
}) => T | Control;
/**
 * @param obj		target
 * @param handler	value handler
 * @param scope		scope or handler
 * @param own		is get own properties, default: true
 */
export declare function values<T, E>(obj: {
	[key: string]: E;
}, own?: boolean): T[];
export declare function values<T, E>(obj: {
	[key: string]: E;
}, callback: ObjValueHandler<T, E>, own?: boolean): T[];
export declare function values<T, E>(obj: {
	[key: string]: E;
}, callback: ObjValueHandler<T, E>, scope?: any, own?: boolean): T[];
/**
 * @return STOP or SKIP or [key: string, value: any]
 */
export declare type Arr2ObjCallback<E, T> = (data: E, index: number, array: IArray<E>) => Control | [string, T];
/**
 * convert array to object
 */
export declare function arr2obj<E, T>(array: IArray<E>, callback: Arr2ObjCallback<E, T>, scope?: any): {
	[key: string]: T;
};
/**
 * convert array or string to object
 * @param array
 * @param val	value or callback
 * @param split	split char on string
 */
export declare function makeMap<E, T>(array: IArray<E>, val: Arr2ObjCallback<E, T>, split?: string): {
	[key: string]: T;
};
export declare function makeMap<E, T>(array: IArray<E>, val?: T, split?: string): {
	[key: string]: T;
};
export declare function makeArray<T>(len: number, callback: (index: number) => T): T[];
export declare type EachControl = Control;
/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:25:40 GMT+0800 (China Standard Time)
 */
export declare function mixin<B>(behaviour: B): <M extends B, T extends new (...args: any[]) => M>(Class: T) => T;
/**
 * @module assert
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 17:42:54 GMT+0800 (China Standard Time)
 */
export interface assert {
	(msg?: string, ...args: any[]): never;
	is(actual: any, msg?: string, ...args: any[]): assert;
	not(actual: any, msg?: string, ...args: any[]): assert;
	eq(actual: any, expect: any, msg?: string, ...args: any[]): assert;
	notEq(actual: any, expect: any, msg?: string, ...args: any[]): assert;
	eql(actual: any, expect: any, msg?: string, ...args: any[]): assert;
	notEql(actual: any, expect: any, msg?: string, ...args: any[]): assert;
	blank(actual: any, msg?: string, ...args: any[]): assert;
	notBlank(actual: any, msg?: string, ...args: any[]): assert;
	nul(actual: any, msg?: string, ...args: any[]): assert;
	notNul(actual: any, msg?: string, ...args: any[]): assert;
	nil(actual: any, msg?: string, ...args: any[]): assert;
	notNil(actual: any, msg?: string, ...args: any[]): assert;
	undef(actual: any, msg?: string, ...args: any[]): assert;
	notUndef(actual: any, msg?: string, ...args: any[]): assert;
	bool(actual: any, msg?: string, ...args: any[]): assert;
	notBool(actual: any, msg?: string, ...args: any[]): assert;
	num(actual: any, msg?: string, ...args: any[]): assert;
	notNum(actual: any, msg?: string, ...args: any[]): assert;
	int(actual: any, msg?: string, ...args: any[]): assert;
	notInt(actual: any, msg?: string, ...args: any[]): assert;
	str(actual: any, msg?: string, ...args: any[]): assert;
	notStr(actual: any, msg?: string, ...args: any[]): assert;
	fn(actual: any, msg?: string, ...args: any[]): assert;
	notFn(actual: any, msg?: string, ...args: any[]): assert;
	primitive(actual: any, msg?: string, ...args: any[]): assert;
	notPrimitive(actual: any, msg?: string, ...args: any[]): assert;
	boolean(actual: any, msg?: string, ...args: any[]): assert;
	notBoolean(actual: any, msg?: string, ...args: any[]): assert;
	number(actual: any, msg?: string, ...args: any[]): assert;
	notNumber(actual: any, msg?: string, ...args: any[]): assert;
	string(actual: any, msg?: string, ...args: any[]): assert;
	notString(actual: any, msg?: string, ...args: any[]): assert;
	date(actual: any, msg?: string, ...args: any[]): assert;
	notDate(actual: any, msg?: string, ...args: any[]): assert;
	reg(actual: any, msg?: string, ...args: any[]): assert;
	notReg(actual: any, msg?: string, ...args: any[]): assert;
	array(actual: any, msg?: string, ...args: any[]): assert;
	notArray(actual: any, msg?: string, ...args: any[]): assert;
	typedArray(actual: any, msg?: string, ...args: any[]): assert;
	notTypedArray(actual: any, msg?: string, ...args: any[]): assert;
	arrayLike(actual: any, msg?: string, ...args: any[]): assert;
	notArrayLike(actual: any, msg?: string, ...args: any[]): assert;
	obj(actual: any, msg?: string, ...args: any[]): assert;
	notObj(actual: any, msg?: string, ...args: any[]): assert;
	nan(actual: any, msg?: string, ...args: any[]): assert;
	notNan(actual: any, msg?: string, ...args: any[]): assert;
	finite(actual: number | string, msg?: string, ...args: any[]): assert;
	notFinite(actual: any, msg?: string, ...args: any[]): assert;
	less(actual: number, expect: number, msg?: string, ...args: any[]): assert;
	notLess(actual: number, expect: number, msg?: string, ...args: any[]): assert;
	greater(actual: number, expect: number, msg?: string, ...args: any[]): assert;
	notGreater(actual: number, expect: number, msg?: string, ...args: any[]): assert;
	match(actual: string, expect: any, msg?: string, ...args: any[]): assert;
	notMatch(actual: string, expect: any, msg?: string, ...args: any[]): assert;
	range(actual: number, start: number, end: number, msg?: string, ...args: any[]): assert;
	notRange(actual: number, start: number, end: number, msg?: string, ...args: any[]): assert;
	throw(fn: () => any, err?: Error | string, msg?: string, ...args: any[]): assert;
	notThrow(fn: () => any, err?: Error | string, msg?: string, ...args: any[]): assert;
	executor<T extends (...args: any[]) => any>(fn: T, maxCall: number, msg?: string): T & {
		called: number;
	};
}
export declare function popErrStack(err: Error, i: number): Error;
export declare const assert: assert;
/**
 * @module format
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:50:54 GMT+0800 (China Standard Time)
 */
export declare function pad(str: string, len: number, chr?: string, leftAlign?: boolean | number): string;
export declare function shorten(str: string, len: number, suffix?: string): string;
export declare const thousandSeparate: (numStr: string) => string, binarySeparate: (numStr: string) => string, octalSeparate: (numStr: string) => string, hexSeparate: (numStr: string) => string;
export declare function plural(str: string): string;
export declare function singular(str: string): string;
export declare type FormatFlags = number;
export declare const FORMAT_XPREFIX: FormatFlags, FORMAT_PLUS: FormatFlags, FORMAT_ZERO: FormatFlags, FORMAT_SPACE: FormatFlags, FORMAT_SEPARATOR: FormatFlags, FORMAT_LEFT: FormatFlags;
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
export declare type Formatter = (...args: any[]) => string;
export declare type FormatParamLoader = (args: IArguments, idx: number) => any;
/**
 * @see vformat
 * @param fmt		format string
 * @param offset	start offset of arguments
 * @param getParam	get parameter on arguments callback
 */
export declare function formatter(fmt: string, offset?: number, getParam?: FormatParamLoader): Formatter;
/**
 * @module util/path
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:47:29 GMT+0800 (China Standard Time)
 */
export declare const PATH_BINDING: string;
export declare function parsePath(propPath: string | string[], cacheable?: boolean): string[];
export declare function formatPath(path: string | (string[] & {
	path?: string;
})): string;
export declare function get<T>(obj: any, path: string | string[]): any;
export declare function set(obj: any, path: string | string[], value: any): void;
/**
 * Double Linked List
 * @module util/list
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 18:28:27 GMT+0800 (China Standard Time)
 */
export declare class List<T> {
	static readonly binding: string;
	readonly binding: string;
	private __head?;
	private __tail?;
	private __length;
	private __scaning;
	private __lazyRemoves?;
	private __ver;
	constructor(binding?: string);
	size(): number;
	has(obj: T): boolean;
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	add(obj: T): number;
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	addFirst(obj: T): number;
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	insertAfter(obj: T, target?: T): number;
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	insertBefore(obj: T, target?: T): number;
	/**
	 *
	 * @param objs
	 * @return new length
	 */
	addAll(objs: T[]): number;
	addFirstAll(objs: T[]): number;
	insertAfterAll(objs: T[], target?: T): number;
	insertBeforeAll(objs: T[], target?: T): number;
	prev(obj: T): T;
	next(obj: T): T;
	first(): T;
	last(): T;
	each(cb: (obj: T) => boolean | void, scope?: any): void;
	eachUnsafe(cb: (obj: T) => boolean | void, scope?: any): void;
	toArray(): T[];
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	remove(obj: T): number;
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
 * @module util/list
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:05:16 GMT+0800 (China Standard Time)
 */
export declare type FnNode<T extends Function> = [string, T, any, any];
export declare class FnList<T extends Function> {
	static readonly fnBinding: string;
	static readonly scopeBinding: string;
	readonly fnBinding: string;
	readonly scopeBinding: string;
	private readonly __list;
	private __nodeMap;
	constructor(fnBinding?: string, scopeBinding?: string);
	/**
	 * add executable function
	 * @param fn		function
	 * @param scope		scope of function
	 * @param data		user data of [function + scope]
	 * @return executable function id, can remove executable function by id: {@link FnList#removeId}
	 */
	add(fn: T, scope?: any, data?: any): string;
	/**
	 * remove executable function by id
	 *
	 * @param id
	 */
	removeId(id: string): number;
	remove(fn: T, scope?: any): number;
	has(fn: T, scope?: any): string;
	hasId(id: string): boolean;
	size(): number;
	clean(): void;
	each(cb: (fn: T, scope: any, data: any, __node: FnNode<T>) => boolean | void, scope?: any): void;
	eachUnsafe(cb: (fn: T, scope: any, data: any, __node: FnNode<T>) => boolean | void, scope?: any): void;
	id(fn: T, scope?: any): string;
}
export declare function nextTick(fn: () => void, scope?: any): string;
export declare function clearTick(fn: () => void, scope?: any): number;
export declare function clearTickId(id: string): number;
/**
 * @module util/Source
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 17 2018 10:41:21 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:58:29 GMT+0800 (China Standard Time)
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
/**
 * Match Context of Rule
 */
export declare class MatchContext {
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
export declare class MatchError {
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
/**
 * Abstract Rule
 */
export declare class Rule {
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
export declare type ComplexRuleBuilder = (rule: Rule) => Rule[];
/**
 * Abstract Complex Rule
 */
export declare class ComplexRule extends Rule {
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
/**
 * AND Complex Rule
 */
export declare class AndRule extends ComplexRule {
	__init(rules: Rule[]): void;
	match(context: MatchContext): MatchError;
	protected rmatch(context: MatchContext): MatchError;
	testRule(rule: Rule, i: number, ctx: MatchContext): MatchError;
}
/**
 * OR Complex Rule
 */
export declare class OrRule extends ComplexRule {
	index: Rule[][];
	__init(rules: Rule[]): void;
	match(context: MatchContext): MatchError;
	protected rmatch(context: MatchContext): MatchError;
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
export declare function genCharCodes(start: number | string, end: number | string, ignoreCase?: boolean): number[];
/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Wed Apr 10 2019 10:11:52 GMT+0800 (China Standard Time)
 */
/**
 * Observer Key
 */
export declare const OBSERVER_KEY: string;
/**
 * the property of observe an array change
 */
export declare const ARRAY_CHANGE = "$change", ARRAY_LENGTH = "length";
export declare type ObserverTarget = any[] | {};
/**
 * change callback for observer
 * @param path 		the observe path
 * @param value 	new value
 * @param original	original value
 */
export declare type ObserverCallback<T extends ObserverTarget> = (path: string[], value: any, original: any, observer: IObserver<T>) => void;
export declare type IWatcher = {
	/**
	 * notify topics
	 * @param original the original value
	 */
	notify(original: any): void;
};
export interface IObserver<T extends ObserverTarget> {
	/**
	 * target of the observer
	 */
	readonly target: T;
	/**
	 * observer proxy
	 */
	readonly proxy: T;
	/**
	 * is array object
	 */
	readonly isArray: boolean;
	/**
	 * observe changes in the observer's target
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observe(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string;
	/**
	 * get listen-id of callback in the observer's target
	 *
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observed(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string;
	/**
	 * has listen-id in the observer's target
	 *
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param id		listen-id
	 * @return listen-id
	 */
	observedId(propPath: string | string[], id: string): boolean;
	/**
	 * cancel observing the changes in the observer's target
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */
	unobserve(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): void;
	/**
	 * cancel observing the changes in the observer's target by listen-id
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param id 		listen-id
	 */
	unobserveId(propPath: string | string[], id: string): void;
	/**
	 * set value
	 * @param propPath 	property path for set, parse string path by {@link parsePath}
	 * @param value		the value
	 */
	set(propPath: string | string[], value: any): void;
	/**
	 * get value
	 * @param propPath 	property path for get, parse string path by {@link parsePath}
	 * @return the value
	 */
	get(propPath: string | string[]): any;
	/**
	 * notify change on the property
	 * @param prop		the property
	 * @param original 	the original value
	 */
	notify(prop: string, original: any): void;
	/**
	 * notify the observer that properties in the target have changed
	 *
	 * @param props 		notify properties, notify all watchers when the props is null or undefined
	 * @param getOriginal	get the original value
	 * @param execludes		do not notify watchers in execludes
	 */
	notifies(props: string[], getOriginal: (prop: string, ob: IObserver<T>) => any, execludes?: {
		[key: string]: any;
	}): void;
}
/**
 * collect the dirty topics on the collectQueue
 */
export declare function collect(): void;
export declare const proxyEnable: "vb" | "proxy";
/**
 * get the original object of the observer on the object
 *
 * @param object the object
 * @return the original object | the object
 */
export declare let source: <T extends ObserverTarget>(obj: T) => T;
/**
 * get the proxy object for the observer on the object
 *
 * @param object the object
 * @return the proxy object | the object
 */
export declare let proxy: <T extends ObserverTarget>(obj: T) => T;
/**
 * support equals function between observer objects
 */
export declare let $eq: (o1: any, o2: any) => boolean;
/**
 * get the value at path of object
 *
 * @param obj 		the object
 * @param path		property path of object, parse string path by {@link parsePath}
 * @return the value | the proxy of value
 */
export declare let $get: (obj: any, path: string | string[]) => any;
/**
 * set the value at path of object
 *
 * @param obj 		the object
 * @param path		property path of object, parse string path by {@link parsePath}
 * @param value 	value
 */
export declare let $set: (obj: any, path: string | string[], value: any) => void;
/**
 * get or create observer on object
 *
 * @param target 	the target object
 * @return the observer
 */
export declare function observer<T extends ObserverTarget>(target: T): IObserver<T>;
/**
 * get or create observer on object
 *
 * @param target 	the target object
 * @return the proxy object
 */
export declare function observable<T extends ObserverTarget>(target: T): T;
/**
 * observe changes in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 * @return listen-id
 */
export declare function observe<T extends ObserverTarget>(target: T, propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string;
/**
 * get listen-id of callback in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 * @return listen-id
 */
export declare function observed<T extends ObserverTarget>(target: T, propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string;
/**
 * has listen-id in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param id		listen-id
 */
export declare function observedId<T extends ObserverTarget>(target: T, propPath: string | string[], id: string): boolean;
/**
 * cancel observing the changes in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 */
export declare function unobserve<T extends ObserverTarget>(target: T, propPath: string | string[], cb: ObserverCallback<T>, scope?: any): void;
/**
 * cancel observing the changes in the target object by listen-id
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param listenId	listen-id
 */
export declare function unobserveId<T extends ObserverTarget>(target: T, propPath: string | string[], listenId: string): void;
export declare const getObserver: <T extends ObserverTarget>(target: T) => IObserver<T>;
export declare const VBPROXY_KEY = "__vbclass_binding__", VBPROXY_CTOR_KEY = "__vbclass_constructor__", OBJECT_DEFAULT_PROPS: string[];
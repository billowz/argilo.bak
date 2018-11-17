import { create, hasOwnProp, isObj } from '../../helper'

export default function(normal, __hooks, defKey, recive) {
	const hooks = create(null),
		revices = recive && create(null)
	__hooks && addHook(__hooks)

	return {
		addHook,
		getHook(key) {
			return hooks[key] || normal
		},
		hookMember(key, member) {
			const hook = hooks[key]
			return hook && hook[member]
		},
		memberHook(key, member) {
			const hook = hooks[key]
			if (hook && hook[member]) return hook
			if (normal[member]) return normal
		},
		hookRevice(key) {
			return revices[key]
		}
	}

	function addHook(key, hook) {
		if (arguments.length === 1) {
			for (var k in key) if (hasOwnProp(key, k)) doAdd(k, key[k])
		} else {
			return doAdd(key, hook)
		}
	}

	function doAdd(key, hook) {
		if (!isObj(hook)) {
			hook = {
				[defKey]: hook
			}
		}
		if (revices && hook[recive]) revices[hook[recive]] = key
		hooks[key] = hook
		return hook
	}
}

exports.__esModule = true;
var is_1 = require("./is");
var prop_1 = require("./prop");
var create_1 = require("./create");
var constructor_1 = require("./constructor");
var REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline'];
function deepEq(actual, expected) {
    if (is_1.eq(actual, expected))
        return true;
    if (actual && expected && constructor_1.getConstructor(actual) === constructor_1.getConstructor(expected)) {
        if (is_1.isPrimitive(actual))
            return String(actual) === String(expected);
        if (is_1.isDate(actual))
            return actual.getTime() === expected.getTime();
        if (is_1.isReg(actual))
            return eqProps(actual, expected, REG_PROPS);
        if (is_1.isArray(actual))
            return eqArray(actual, expected, deepEq);
        if (is_1.isTypedArray(actual))
            return eqArray(actual, expected, is_1.eq);
        return eqObj(actual, expected);
    }
    return false;
}
exports.deepEq = deepEq;
function eqProps(actual, expected, props) {
    var i = props.length;
    while (i--)
        if (actual[props[i]] !== expected[props[i]])
            return false;
    return true;
}
function eqArray(actual, expected, eq) {
    var i = actual.length;
    if (i !== expected.length)
        return false;
    while (i--)
        if (!eq(actual[i], expected[i]))
            return false;
    return true;
}
function eqObj(actual, expected) {
    var cache = create_1.create(null);
    var k;
    for (k in actual) {
        if (notEqObjKey(actual, expected, k))
            return false;
        cache[k] = true;
    }
    for (k in expected) {
        if (!cache[k] && notEqObjKey(actual, expected, k))
            return false;
    }
    return true;
}
function notEqObjKey(actual, expected, k) {
    return prop_1.hasOwnProp(actual, k) ? !prop_1.hasOwnProp(expected, k) || !deepEq(actual[k], expected[k]) : prop_1.hasOwnProp(expected, k);
}
//# sourceMappingURL=deepEq.js.map
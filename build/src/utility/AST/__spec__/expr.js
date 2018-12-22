exports.__esModule = true;
var collection_1 = require("../../collection");
var api_1 = require("../api");
var UNDEFINED = api_1.match('undefined', api_1.attachMatch(undefined)), NULL = api_1.match('null', api_1.attachMatch(null)), BOOLEAN = api_1.match('boolean', /true|false/, 'tf', api_1.attachMatch(function (b) { return b === 'true'; })), NUMBER = api_1.match('number', /[+-]?(?:0x[\da-f]+|0X[\dA-F]+|0[oO][0-7]+|0[bB][01]+|(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/, '+-0123456789', api_1.attachMatch(function (n) { return +n; })), STRING = api_1.match('string', /"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)'/, -2, "'\"");
var VALUE = api_1.or('value', function () { return [UNDEFINED, NULL, BOOLEAN, NUMBER, STRING, ARRAY, OBJECT]; }, api_1.appendMatch);
var OBJECT_PROPERTY = api_1.and('property', [/\s*/, STRING, /\s*:\s*/, VALUE, /\s*/]), OBJECT = api_1.and('object', ['{', api_1.option('properties', [OBJECT_PROPERTY, api_1.any([',', OBJECT_PROPERTY], api_1.appendMatch)], api_1.appendMatch), '}'], api_1.attachMatch(function (data) { return collection_1.arr2obj(data, function (d) { return d; }); }));
var ARRAY_ELEM = api_1.and('element', [/\s*/, VALUE, /\s*/], api_1.appendMatch), ARRAY = api_1.and('array', ['[', api_1.option('elements', [ARRAY_ELEM, api_1.any([',', ARRAY_ELEM], api_1.appendMatch)]), ']'], api_1.appendMatch);
exports.json = api_1.and([/\s*/, VALUE, /\s*$/], api_1.appendMatch).init();
//# sourceMappingURL=expr.js.map
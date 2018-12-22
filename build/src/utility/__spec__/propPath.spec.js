var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var propPath_1 = require("../propPath");
describe('utility/path', function () {
    it('parsePath', function () {
        expect_js_1["default"](propPath_1.parsePath('a')).to.eql(['a']);
        expect_js_1["default"](propPath_1.parsePath('$abc12')).to.eql(['$abc12']);
        expect_js_1["default"](propPath_1.parsePath('_a12bc')).to.eql(['_a12bc']);
        expect_js_1["default"](propPath_1.parsePath('[0]')).to.eql(['0']);
        expect_js_1["default"](propPath_1.parsePath('a.b.c')).to.eql(['a', 'b', 'c']);
        expect_js_1["default"](propPath_1.parsePath('a["b"].c')).to.eql(['a', 'b', 'c']);
        expect_js_1["default"](propPath_1.parsePath('a[0].c')).to.eql(['a', '0', 'c']);
    });
    it('formatPath', function () {
        expect_js_1["default"](propPath_1.formatPath(['a', 'b', 'c'])).to.eql('["a"]["b"]["c"]');
        expect_js_1["default"](propPath_1.formatPath(['a', '0', 'c'])).to.eql("[\"a\"][\"0\"][\"c\"]");
        expect_js_1["default"](propPath_1.formatPath(['a', '/ad2', 'c'])).to.eql("[\"a\"][\"/ad2\"][\"c\"]");
    });
});
//# sourceMappingURL=propPath.spec.js.map
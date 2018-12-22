var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var string_1 = require("../string");
describe('utility/string', function () {
    it('trim', function () {
        expect_js_1["default"](string_1.trim('')).to.equal('');
        expect_js_1["default"](string_1.trim(' ')).to.equal('');
        expect_js_1["default"](string_1.trim('   ')).to.equal('');
        expect_js_1["default"](string_1.trim('a  ')).to.equal('a');
        expect_js_1["default"](string_1.trim('  a')).to.equal('a');
        expect_js_1["default"](string_1.trim('  a  ')).to.equal('a');
    });
    it('strval');
    it('thousandSeparate');
    it('plural');
    it('singular');
    it('escapeStr');
});
//# sourceMappingURL=string.spec.js.map
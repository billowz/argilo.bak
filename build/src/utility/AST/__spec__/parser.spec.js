var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var json_1 = require("./json");
var package_json_1 = __importDefault(require("../../../../package.json"));
var assert_1 = require("../../assert");
describe('utility/AST', function () {
    describe('json', function () {
        it('json', function () {
            assert_1.assert.eql(json_1.json.parse(JSON.stringify(package_json_1["default"]))[0], package_json_1["default"]);
            assert_1.assert.eql(json_1.json.parse(JSON.stringify(package_json_1["default"], null, '  '))[0], package_json_1["default"]);
            assert_1.assert.eql(json_1.json.parse(JSON.stringify(package_json_1["default"], null, '\t'))[0], package_json_1["default"]);
        });
    });
});
//# sourceMappingURL=parser.spec.js.map
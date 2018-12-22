var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var proto_1 = require("../proto");
describe('utility/proto', function () {
    it('protoOf', function () {
        expect_js_1["default"](proto_1.protoOf({})).to.equal(Object.prototype);
        expect_js_1["default"](proto_1.protoOf(new Object())).to.equal(Object.prototype);
        function A() { }
        expect_js_1["default"](proto_1.protoOf(A)).to.equal(Function.prototype);
        expect_js_1["default"](proto_1.protoOf(new A())).to.equal(A.prototype);
    });
    it('setProto', function () {
        var a = {}, b = { a: 1 };
        function A() { }
        proto_1.setProto(a, b);
        expect_js_1["default"](proto_1.protoOf(a)).to.equal(b);
        expect_js_1["default"](a.a).to.equal(1);
        proto_1.setProto(A, b);
        expect_js_1["default"](proto_1.protoOf(A)).to.equal(b);
        expect_js_1["default"](proto_1.protoOf(new A())).to.equal(A.prototype);
    });
});
//# sourceMappingURL=proto.spec.js.map
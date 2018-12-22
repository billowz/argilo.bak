var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var expect_js_1 = __importDefault(require("expect.js"));
var create_1 = require("../create");
var prop_1 = require("../prop");
var proto_1 = require("../proto");
describe('create', function () {
    it('create', function () {
        var o = { a: 1 }, o2 = create_1.create(o);
        expect_js_1["default"](o2.a).to.equal(1);
        expect_js_1["default"](prop_1.hasOwnProp(o2, 'a')).to.equal(false);
        expect_js_1["default"](proto_1.protoOf(o2)).to.equal(o);
        o2.a = 2;
        expect_js_1["default"](o.a).to.equal(1);
    });
    it('constructor', function () {
        var a = {};
        function A() { }
        function B() { }
        expect_js_1["default"](a.constructor).to.equal(Object);
        expect_js_1["default"](A.constructor).to.equal(Function);
        expect_js_1["default"](B.constructor).to.equal(Function);
        expect_js_1["default"](A.prototype.constructor).to.equal(A);
        expect_js_1["default"](B.prototype.constructor).to.equal(B);
        expect_js_1["default"](new A().constructor).to.equal(A);
        B.prototype = create_1.create(A.prototype);
        expect_js_1["default"](B.prototype.constructor).to.equal(A);
        expect_js_1["default"](new B().constructor).to.equal(A);
        B.prototype.constructor = B;
        expect_js_1["default"](new B().constructor).to.equal(B);
    });
});
//# sourceMappingURL=create.spec.js.map
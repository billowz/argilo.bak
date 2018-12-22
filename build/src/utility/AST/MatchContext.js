exports.__esModule = true;
var string_1 = require("../string");
var assert_1 = require("../assert");
/**
 * Match Context of Rule
 */
var MatchContext = /** @class */ (function () {
    function MatchContext(source, buff, offset, orgPos, parent, code) {
        this.source = source;
        this.buff = buff;
        this.offset = offset;
        this.orgPos = orgPos;
        this.parent = parent;
        this.data = [];
        this.advanced = 0;
        code ? (this.codeCache = code) : this.flushCache();
    }
    MatchContext.prototype.flushCache = function () {
        var _a = this, buff = _a.buff, offset = _a.offset;
        this.codeCache = offset < buff.length ? string_1.charCode(buff, offset) : 0;
    };
    /**
     * create sub Context
     */
    MatchContext.prototype.create = function () {
        return new MatchContext(this.source, this.buff, this.offset, this.orgPos + this.advanced, this, this.codeCache);
    };
    /**
     * commit context states to parent context
     * @param margeData is marge data to parent
     */
    MatchContext.prototype.commit = function () {
        var advanced = this.advanced;
        this.parent.advance(advanced);
        this.orgPos += advanced;
        this.advanced = 0;
    };
    /**
     *
     * @param len 		reset buff length
     * @param dataLen 	reset data length
     */
    MatchContext.prototype.reset = function (len, dataLen) {
        len || (len = 0);
        assert_1.assert.range(len, 0, this.advanced + 1);
        this.advance(-(this.advanced - len));
        this.resetData(dataLen || 0);
    };
    MatchContext.prototype.len = function () {
        return this.advanced;
    };
    /**
     * advance buffer position
     */
    MatchContext.prototype.advance = function (i) {
        this.offset += i;
        this.advanced += i;
        if (this.offset < 0) {
            this.buff = this.source.buff;
            this.offset = this.orgPos + this.advanced;
        }
        this.flushCache();
    };
    /**
     * get buffer
     * @param reset reset buffer string from 0
     */
    MatchContext.prototype.getBuff = function (reset) {
        if (reset) {
            var offset = this.offset;
            this.buff = this.buff.substring(offset);
            this.offset = 0;
        }
        return this.buff;
    };
    MatchContext.prototype.getOffset = function () {
        return this.offset;
    };
    MatchContext.prototype.startPos = function () {
        return this.orgPos;
    };
    MatchContext.prototype.currPos = function () {
        return this.orgPos + this.advanced;
    };
    MatchContext.prototype.pos = function () {
        var orgPos = this.orgPos;
        return [orgPos, orgPos + this.advanced];
    };
    /**
     * get next char code
     * @return number char code number
     */
    MatchContext.prototype.nextCode = function () {
        return this.codeCache;
    };
    MatchContext.prototype.nextChar = function () {
        return string_1.char(this.codeCache);
    };
    MatchContext.prototype.eof = function () {
        return this.codeCache === 0;
    };
    //──── data opeartions ───────────────────────────────────────────────────────────────────
    /**
     * append data
     */
    MatchContext.prototype.add = function (data) {
        var _data = this.data;
        _data[_data.length] = data;
    };
    /**
     * append datas
     */
    MatchContext.prototype.addAll = function (data) {
        var _data = this.data;
        var len = _data.length;
        var i = data.length;
        while (i--)
            _data[len + i] = data[i];
    };
    /**
     * reset result data size
     */
    MatchContext.prototype.resetData = function (len) {
        var data = this.data;
        len = len || 0;
        if (data.length > len)
            data.length = len;
    };
    MatchContext.prototype.dataLen = function () {
        return this.data.length;
    };
    return MatchContext;
}());
exports.MatchContext = MatchContext;
//# sourceMappingURL=MatchContext.js.map
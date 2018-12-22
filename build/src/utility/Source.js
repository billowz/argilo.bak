/**
 * @module utility/Source
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 17 2018 10:41:21 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 13:22:43 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var format_1 = require("./format");
var string_1 = require("./string");
var LINE_REG = /([^\n]+)?(\n|$)/g;
var Source = /** @class */ (function () {
    function Source(buff) {
        this.buff = buff;
        this.len = buff.length;
        this.lines = [];
        this.linePos = 0;
    }
    Source.prototype.position = function (offset) {
        var _a = this, buff = _a.buff, len = _a.len, lines = _a.lines, linePos = _a.linePos;
        var i = lines.length, p;
        if (offset < linePos) {
            while (i--) {
                p = offset - lines[i][0];
                if (p >= 0)
                    return [i + 1, p, lines[i][1]];
            }
        }
        else {
            if (linePos < len) {
                var m;
                LINE_REG.lastIndex = p = linePos;
                while ((m = LINE_REG.exec(buff))) {
                    lines[i++] = [p, m[1] || ''];
                    p = LINE_REG.lastIndex;
                    if (!p || offset < p)
                        break;
                }
                this.linePos = p || len;
            }
            return i ? [i, (offset > len ? len : offset) - lines[i - 1][0], lines[i - 1][1]] : [1, 0, ''];
        }
    };
    Source.prototype.source = function (escape) {
        var buff = this.buff;
        var line = 1, toSourceStr = escape ? escapeSourceStr : sourceStr;
        return buff.replace(LINE_REG, function (m, s, t) { return format_1.pad(String(line++), 3) + ': ' + toSourceStr(m, s, t); });
    };
    return Source;
}());
exports.Source = Source;
function sourceStr(m, s, t) {
    return m || '';
}
function escapeSourceStr(m, s, t) {
    return s ? string_1.escapeStr(s) + t : t;
}
//# sourceMappingURL=Source.js.map
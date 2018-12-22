exports.__esModule = true;
var collection_1 = require("../collection");
var api_1 = require("./api");
var reg_1 = require("../reg");
var string_1 = require("../string");
var EXPR_START = '{', EXPR_END = '}';
var AutoCloseElems = collection_1.makeMap('input'), ContentElems = collection_1.makeMap('textarea');
var EXPR_START_LEN = EXPR_START.length, EXPR_END_LEN = EXPR_END.length;
var EXPR_KEY_WORDS = "\"'`[{";
api_1.and('a', function () { return []; }, api_1.discardMatch);
var EXPR_KEYS = api_1.match(EXPR_KEY_WORDS.split(''), api_1.discardMatch), EXPR_STR = api_1.match(/"(?:[^\\"\n]|\\.)*"|'(?:[^\\'\n]|\\.)*'|`(?:[^\\`]|\\.)*`/, "'\"`", false, api_1.discardMatch), ExprObject = api_1.and('ExprObject', function () { return [
    '{',
    api_1.anyOne('ObjBody', [
        EXPR_STR,
        ExprObject,
        ExprArray,
        EXPR_KEYS,
        new RegExp("[^" + reg_1.reEscape(EXPR_KEY_WORDS + '}') + "]+") // consume chars which before start codes of EXPR_STR | ExprObject | ExprArray and "}"
    ], api_1.discardMatch),
    '}'
]; }, api_1.discardMatch), ExprArray = api_1.and('ExprArray', function () { return [
    '[',
    api_1.anyOne('ArrayBody', [EXPR_STR, ExprObject, ExprArray, EXPR_KEYS, new RegExp("[^" + reg_1.reEscape(EXPR_KEY_WORDS + ']') + "]+")], api_1.discardMatch),
    ']'
]; }), Expr = api_1.and('Expr', [
    ['ExprStart', EXPR_START, attachOffset],
    api_1.anyOne('ExprBody', [
        EXPR_STR,
        ExprObject,
        ExprArray,
        api_1.match((EXPR_KEY_WORDS + EXPR_START[0]).split(''), api_1.discardMatch),
        new RegExp("[^" + reg_1.reEscape(EXPR_KEY_WORDS + EXPR_START[0] + EXPR_END[0]) + "]+")
    ], api_1.discardMatch),
    ['ExprEnd', EXPR_END, attachOffset]
], function (data, len, ctx) {
    var content_start = data[0], expr_end = data[1];
    ctx.add([
        ctx.source.buff.substring(content_start, expr_end - EXPR_END_LEN),
        content_start - EXPR_START_LEN,
        expr_end
    ]);
});
function createStringRule(name, mask, mline) {
    return api_1.and(name, [
        api_1.match(mask, attachOffset),
        api_1.anyOne([
            Expr,
            EXPR_START[0],
            new RegExp("(?:[^\\\\" + (mline ? '' : '\\n') + mask + reg_1.reEscape(EXPR_START[0]) + "]|\\\\.)+") // string fragment
        ]),
        api_1.match(mask, attachOffset)
    ], function (data, len, ctx) {
        var buff = ctx.source.buff;
        var start = data[0], end = data[2] - 1, exprs = data[1];
        if (exprs.length) {
            var offset = start - 1;
            var i = 0, l = exprs.length, estart;
            var expr = [];
            for (; i < l; i++) {
                estart = exprs[i][1];
                if (start < estart)
                    expr.push(exprStr(buff, start, estart));
                expr.push("(" + exprs[i][0] + ")");
                start = exprs[i][2];
            }
            if (start < end)
                expr.push(exprStr(buff, start, end));
            ctx.add(['expr', expr.join(' + '), offset, end + 1]);
        }
        else {
            ctx.add(['string', buff.substring(start, end)]);
        }
    });
    function exprStr(buff, start, end) {
        return "\"" + string_1.escapeStr(buff.substring(start, end)) + "\"";
    }
}
var ATTR_NAME = api_1.match('AttrName', /([@:$_a-zA-Z][\w-\.]*)\s*/, 1), AttrValue = api_1.or('AttrValue', [
    createStringRule('SQString', "'"),
    createStringRule('DQString', '"'),
    createStringRule('MString', '`', true),
    api_1.and([Expr], attachValue('expr', function (expr) { return expr[0][0]; })),
    api_1.match('Number', /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/, '-0123456789', attachValue('number', function (num) { return +num; })),
    api_1.match('NaN', attachStaticValue('number', NaN)),
    api_1.match('undefined', attachStaticValue('undefined', undefined)),
    api_1.match('null', attachStaticValue('null', undefined)),
    api_1.match('true', attachStaticValue('boolean', true)),
    api_1.match('false', attachStaticValue('boolean', false))
], false, function (data, len, ctx) { return ctx.add(data[0]); }), Attrs = api_1.any('Attrs', [ATTR_NAME, api_1.option('AttrValue', [[/=\s*/, false, '=', api_1.discardMatch], AttrValue, /\s*/])], function (data, length, ctx) {
    var attrs = {};
    for (var i = 0, l = data.length; i < l; i += 2)
        attrs[data[i]] = data[i + 1][0];
    ctx.add(attrs);
});
var ELEM_NAME_REG = '[_a-zA-Z][\\w-]*', ELEM_NAME = api_1.match('ElemName', new RegExp("<(" + ELEM_NAME_REG + ")\\s*"), 1, '<'), NodeCollection = api_1.anyOne('NodeCollection', function () { return [
    Elem,
    api_1.and([Expr], function (data, len, ctx) {
        ctx.add({ type: 'expr', data: data[0][0] });
    }),
    api_1.match('<', function (data, len, ctx, rule) {
        //consume one char when Elem match failed
        if (ctx.nextCode() === 47)
            // is close element
            return rule.mkErr('expect: /<[^/]/', ctx);
        attachText(data, len, ctx); // not element
    }),
    api_1.match(EXPR_START[0], attachText),
    api_1.match(new RegExp("[^\\\\<" + reg_1.reEscape(EXPR_START[0]) + "]+|\\\\" + reg_1.reEscape(EXPR_START[0])), attachText)
]; }), Elem = api_1.and('Elem', [
    ELEM_NAME,
    Attrs,
    api_1.or('ElemBody', [
        api_1.match(/\/>\s*/, false, '/', api_1.discardMatch),
        api_1.and('childNodes', [
            api_1.match(/>/, false, '>', api_1.discardMatch),
            NodeCollection,
            api_1.option([api_1.match('ElemClose', new RegExp("</(" + ELEM_NAME_REG + ")>\\s*"), 1, '<')], function (data, len, ctx) {
                var closeTag = data[0], pctx = ctx.parent.parent, tag = pctx.data[0];
                if (closeTag) {
                    if (closeTag !== tag) {
                        if (AutoCloseElems[tag]) {
                            ctx.reset();
                        }
                        else {
                            return "expect: </" + tag + ">";
                        }
                    }
                }
                else if (!AutoCloseElems[tag]) {
                    return "expect: </" + tag + ">";
                }
            })
        ])
    ])
], function (data, len, ctx) {
    var tag = data[0], children = data[2][0] && data[2][0][0], elem = { type: 'elem', tag: tag, attrs: data[1], children: children };
    ctx.add(elem);
    if (children && AutoCloseElems[tag]) {
        ctx.addAll(children);
        children.length = 0;
    }
});
function attachText(text, length, ctx) {
    var data = ctx.data, len = data.length;
    var prev;
    if (len && (prev = data[len - 1]) && prev.type === 'text') {
        prev.data += text;
    }
    else {
        ctx.add({ type: 'text', data: text });
    }
}
exports.ElemContent = api_1.and('Elem-Content', [/\s*/, api_1.many([Elem]), api_1.match('EOF', /\s*$/, api_1.discardMatch)], function (data, len, ctx) {
    ctx.addAll(data[0]);
});
exports.ElemContent.init();
function attachValue(type, valHandler) {
    return function (data, len, ctx) {
        ctx.add([type, valHandler(data)]);
    };
}
function attachStaticValue(type, val) {
    return attachValue(type, function (v) { return v; });
}
function attachOffset(data, len, ctx) {
    ctx.add(ctx.currPos());
}
//# sourceMappingURL=test.js.map
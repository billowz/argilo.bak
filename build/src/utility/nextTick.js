exports.__esModule = true;
/**
 * String format
 * @module utility/nextTick
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 16:59:56 GMT+0800 (China Standard Time)
 */
var List_1 = require("./List");
var is_1 = require("./is");
var ticks = new List_1.FnList();
var pending = false;
var next;
function executeTick(fn, scope) {
    scope ? fn.call(scope) : fn();
}
function flush() {
    ticks.each(executeTick);
    ticks.clean();
    pending = false;
}
if (is_1.isFn(MutationObserver)) {
    // chrome18+, safari6+, firefox14+,ie11+,opera15
    var counter = 0, observer = new MutationObserver(flush), textNode = document.createTextNode(counter + '');
    observer.observe(textNode, {
        characterData: true
    });
    next = function () {
        textNode.data = counter + '';
        counter = counter ? 0 : 1;
    };
}
else {
    next = function () {
        setTimeout(flush, 0);
    };
}
function nextTick(fn, scope) {
    ticks.add(fn, scope);
    if (!pending) {
        pending = true;
        next();
    }
}
exports.nextTick = nextTick;
function clearTick(fn, scope) {
    ticks.remove(fn, scope);
}
exports.clearTick = clearTick;
//# sourceMappingURL=nextTick.js.map
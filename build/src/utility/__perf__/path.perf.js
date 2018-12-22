exports.__esModule = true;
var propPath_1 = require("../propPath");
suite('path.parsePath(cache disabled)', function () {
    benchmark('path.parsePath', function () {
        propPath_1.parsePath('a.b[0].c', false);
    });
});
suite('path.parsePath(cache enabled)', function () {
    benchmark('path.parsePath', function () {
        propPath_1.parsePath('a.b[0].c');
    });
});
suite('path.parsePath(random path & cache disabled)', function () {
    var i = 0;
    benchmark('path.parsePath', function () {
        propPath_1.parsePath('a.b[' + (i++ % 1000) + '].c', false);
    });
});
suite('path.parsePath(random path & cache enabled)', function () {
    var i = 0;
    benchmark('path.parsePath', function () {
        propPath_1.parsePath('a.b[' + (i++ % 1000) + '].c');
    });
});
//# sourceMappingURL=path.perf.js.map
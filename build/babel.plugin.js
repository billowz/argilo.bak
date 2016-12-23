var babel = require('rollup-plugin-babel')
module.exports = function() {
  babel({
    runtimeHelpers: false,
    presets: ["es2015-loose-rollup"],
    plugins: [
      "transform-es3-member-expression-literals",
      "transform-es3-property-literals"
    ]
  })
}

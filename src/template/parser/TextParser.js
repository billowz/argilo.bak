import {
  createClass
} from 'ilos'
export default createClass({
  constructor(prefix, suffix) {
    this.prefix = prefix
    this.suffix = suffix
    this.firstPrefix = prefix.charAt(0)
    this.firstSuffix = suffix.charAt(0)
  },
  tokens(text) {
    let matching = false,
      strMatching = false,
      escapeMatched = 0,
      prefix = this.prefix,
      prefixLen = prefix.length,
      firstPrefix = this.firstPrefix,
      suffix = this.suffix,
      suffixLen = suffix.length,
      firstSuffix = this.firstSuffix,
      i = 0,
      len = text.length,
      c,
      tokens = []
    while (i < len) {
      c = text.charAt(i)
      if (c == '\\') {
        escapeMatched++
        i++
        continue
      } else if (c == firstPrefix) {
        if (!strMatching && (prefixLen == 1 || text.slice(i, i + prefixLen) == prefix)) {
          matching = i = i + prefixLen
          continue
        }
      } else if (matching) {
        switch (c) {
          case "'":
          case '"':
            if (!(escapeMatched & 1)) {
              if (!strMatching) {
                strMatching = c
              } else if (strMatching == c) {
                strMatching = false
              }
            }
            break
          case firstSuffix:
            if (!strMatching && (suffixLen == 1 || text.slice(i, i + suffixLen) == suffix)) {
              tokens.push({
                token: text.slice(matching, i),
                start: matching - prefixLen,
                end: i + suffixLen
              })
              matching = false
            }
            break
        }
      }
      i++
      escapeMatched = 0
    }
    return tokens
  }
})

import _ from 'ilos'

const reg = /{([^{]+)}/g
export default _.dynamicClass({
  constructor(text) {
    this.text = text
    this.index = 0
  },
  nextToken() {
    let token = reg.exec(this.text)

    if (token) {
      let index = this.index = reg.lastIndex

      return {
        token: token[1],
        start: index - token[0].length,
        end: index
      }
    }
    this.index = 0
  }
})

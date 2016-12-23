function doc(title, desc, template, builder) {
  return {
    type: 'script',
    title: title,
    description: desc,
    template: template,
    builder: builder
  }
}

export default [
  doc('text', '', `
    <span v-text="msg"></span>
    <!-- same as -->
    <span>{{msg}}</span>
    `, function(argilo, template) {
    argilo({
      template: template
    }).compile({})
  })
]

module.exports = {
  resolve: {
      extensions: ['.js'],
      alias: {
          'vue': 'vue/dist/vue.common.js'
      },
      node: {
        __dirname: false,
        __filename: false
      }
  }
}
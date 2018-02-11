const bodyParser = require('body-parser')
const session = require('express-session')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
 plugins: ['plugins/element-ui.js', 'plugins/vue-clipboard'],
  /*
  ** Global CSS
  */
  css: ['node_modules/element-ui/lib/theme-chalk/index.css','~/assets/css/main.css'],
  /*
  ** Add axios globally
  */
  env: {
    baseUrl: process.env.HOST,
  },
  build: {
    vendor: ['axios', 'vue-clipboard2'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: ['auth']
  }
}

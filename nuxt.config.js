let serverConfig = require('./server/config').serverConfig;
let port = serverConfig[process.env.NODE_ENV].port

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '直播之窗 - 直播搜索引擎',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '网络直播平台爬虫' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  router: {
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/pure-min.css',
    '~/assets/css/include/util.css'
  ],
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL:`http://${process.env.HOST || 'localhost'}:${process.env.PORT || port}`,
    browserBaseURL: '/'
  },
  plugins: [
    '~/plugins/directives.js',
    {src: '~/plugins/lazyload.js', ssr: false}
  ],
  /*
  ** Add axios globally
  */
  build: {
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
  }
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // for development
  // https://cli.vuejs.org/config/#devserver-proxy
  devServer: {
    // https: true,
    proxy: {
      '^/inbound': {
        // target: 'http://localhost:8000',
        target: 'http://api-dev.connectco.me:8000',
        // ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/inbound': '/inbound'},
        logLevel: 'debug'
      },

      '^/infra': {
        // target: 'http://localhost:8000',
        target: 'http://api-dev.connectco.me:8000',
        // ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/pages': '/pages'},
        logLevel: 'debug'
      },

    }
  },

  // use this option for production linking
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/4.0/' : '/',
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false,
    },
  },
})

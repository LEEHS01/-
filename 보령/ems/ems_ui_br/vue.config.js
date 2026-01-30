const { defineConfig } = require('@vue/cli-service')
// const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // configureWebpack: {
  //   // 환경 변수 설정
  //   plugins: [
  //     new webpack.DefinePlugin({
  //       'process.env': {
  //         VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL)
  //       }
  //     })
  //   ]
  // }
})

const path = require('path')

module.exports = {
    publicPath: './',
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false,
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src/')
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080' // 개발서버
            }
        }
    },
    transpileDependencies: ['quasar'],
};

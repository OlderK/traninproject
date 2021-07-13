const CompressionPlugin = require("compression-webpack-plugin")
const BiyiMsConfigPlugin = require('biyi-ms-config-plugin')
const indexHtml = require("./index.html")
module.exports = {
  chainWebpack: config => {
    // 开启js、css压缩，生成gz压缩文件
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test: /\.js$|\.html$|\.css$|\.svg$/, // 匹配文件名
          threshold: 102400, // 对超过100k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
      config.plugin('BiyiMsConfigPlugin').use(new BiyiMsConfigPlugin([{
          fileName: 'micro-service-config.js',
          path: 'public/configs',
          content: ''
        },
        {
          fileName: 'index.html',
          path: 'public',
          content: indexHtml
        }
      ]))
    }
  },
  transpileDependencies: [
    'biyi-admin',
    'biyi-captcha'
  ]
}

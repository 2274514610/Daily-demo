module.exports = {
    lintOnSave: false,
    // baseUrl: process.env.NODE_ENV === 'production' ? '/online/' : '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://39.97.177.126:8080', // 配置目标的地址
                ws: true, // proxy websockets
                changeOrigin: true, // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': ' ' // rewrite path
                }
            }
        } // 配置多个代理
    },
}